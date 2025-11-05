import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query = '', businessId = null, day = null } = body;

    console.log('Search API called with:', { query, businessId, day });

    // Build businesses query
    let businessesQuery = supabase.from('businesses').select('*');
    
    if (businessId) {
      businessesQuery = businessesQuery.eq('id', businessId);
    } else if (query) {
      // If there's a search query, filter by it
      businessesQuery = businessesQuery.or(`name.ilike.%${query}%, city.ilike.%${query}%, address.ilike.%${query}%`);
    }

    const { data: businessesData, error: businessesError } = await businessesQuery;

    if (businessesError) {
      console.error('Businesses search error:', businessesError);
      return NextResponse.json({ businesses: [], specialists: [] }, { status: 200 });
    }

    // Build specialists query
    let specialistsQuery = supabase
      .from('specialists')
      .select('*, businesses:business_id (name, city, address)');
    
    if (businessId) {
      specialistsQuery = specialistsQuery.eq('business_id', businessId);
    }
    
    // Filter by day availability
    if (day !== null && day !== undefined && day !== "") {
      const dayNum = parseInt(day);
      if (!isNaN(dayNum)) {
        specialistsQuery = specialistsQuery.contains('availabilities', [dayNum]);
      }
    }
    
    // If there's a search query, filter by it
    if (query) {
      specialistsQuery = specialistsQuery.or(`name.ilike.%${query}%, intro.ilike.%${query}%`);
    }

    const { data: specialistsData, error: specialistsError } = await specialistsQuery;

    if (specialistsError) {
      console.error('Specialists search error:', specialistsError);
      return NextResponse.json({ businesses: businessesData || [], specialists: [] }, { status: 200 });
    }

    return NextResponse.json({
      businesses: businessesData || [],
      specialists: specialistsData || []
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', businesses: [], specialists: [] },
      { status: 500 }
    );
  }
}




