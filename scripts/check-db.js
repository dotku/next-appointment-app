#!/usr/bin/env node

/**
 * 检查 Supabase 数据库中的表和数据
 * 使用方法: node scripts/check-db.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 加载环境变量
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 错误: 未找到环境变量');
  console.log('\n请在项目根目录创建 .env.local 文件，添加:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

console.log('🔍 检查 Supabase 数据库...\n');
console.log('URL:', supabaseUrl);
console.log('');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 要检查的表列表
const tablesToCheck = [
  'profiles',
  'businesses',
  'specialists',
  'services',
  'appointments',
  'tasks',
  'roles',
  'profile_roles'
];

async function checkTable(tableName) {
  try {
    // 尝试查询表（只获取一条记录作为检查）
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        name: tableName,
        exists: false,
        count: 0,
        error: error.message,
        schema: null
      };
    }

    // 尝试获取实际数据来推断 schema
    let schema = null;
    if (count > 0) {
      const { data: sampleData } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (sampleData && sampleData.length > 0) {
        schema = Object.keys(sampleData[0]).map(key => {
          const value = sampleData[0][key];
          let type = typeof value;
          
          // 更准确的类型检测
          if (value === null) {
            type = 'null';
          } else if (Array.isArray(value)) {
            type = 'array';
          } else if (value instanceof Date) {
            type = 'date';
          } else if (typeof value === 'object' && value !== null) {
            type = 'object';
          }
          
          return { name: key, type: type };
        });
      }
    }

    return {
      name: tableName,
      exists: true,
      count: count || 0,
      error: null,
      schema: schema
    };
  } catch (err) {
    return {
      name: tableName,
      exists: false,
      count: 0,
      error: err.message,
      schema: null
    };
  }
}

async function runCheck() {
  // 先获取所有结果
  const results = await Promise.all(
    tablesToCheck.map(tableName => checkTable(tableName))
  );

  // 显示表格
  console.log('┌────────────────────┬────────┬───────┬────────────────────────┐');
  console.log('│ 表名                │ 状态    │ 记录数 │ 错误信息              │');
  console.log('├────────────────────┼────────┼───────┼────────────────────────┤');

  results.forEach(result => {
    const status = result.exists ? '✅ 存在' : '❌ 不存在';
    const count = result.exists ? result.count : '-';
    const error = result.error ? result.error.slice(0, 20) : '-';
    
    console.log(`│ ${result.name.padEnd(18)} │ ${status} │ ${String(count).padStart(5)} │ ${error.padEnd(22)} │`);
  });

  console.log('└────────────────────┴────────┴───────┴────────────────────────┘\n');

  // 统计
  const existingCount = results.filter(r => r.exists).length;
  const totalRows = results
    .filter(r => r.exists)
    .reduce((sum, r) => sum + r.count, 0);

  console.log('📊 统计:');
  console.log(`   - 存在 ${existingCount}/${tablesToCheck.length} 个表`);
  console.log(`   - 总记录数: ${totalRows}`);
  
  if (existingCount === 0) {
    console.log('\n💡 提示: 数据库中还没有表，请运行 seed.sql 创建表');
    console.log('   在 Supabase Dashboard 的 SQL Editor 中执行 src/supabase/seed.sql');
  } else if (existingCount < tablesToCheck.length) {
    console.log('\n⚠️  警告: 部分表缺失，可能需要更新数据库结构');
  } else if (totalRows === 0) {
    console.log('\n✅ 所有表已创建，但还没有数据');
  } else {
    console.log('\n✅ 数据库已初始化并包含数据');
  }

  console.log('');
  console.log('📋 表结构 (Schema):');
  console.log('');

  // 显示每个表的结构
  results.forEach(result => {
    if (result.exists && result.schema) {
      console.log(`\n📌 ${result.name.toUpperCase()}`);
      console.log(`${'─'.repeat(80)}`);
      
      result.schema.forEach(col => {
        console.log(`  • ${col.name.padEnd(30)} ${col.type}`);
      });
      
      console.log('');
    } else if (result.exists && result.count === 0) {
      console.log(`\n📌 ${result.name.toUpperCase()} - 表存在但为空`);
      console.log('');
    }
  });

  console.log('');
}

runCheck().catch(err => {
  console.error('❌ 发生错误:', err.message);
  process.exit(1);
});

