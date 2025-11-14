"use client";

import { Input } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";
import { useAppDispatch } from "@/src/lib/hooks";
import { setKeywordsFilter, setSpecialists } from "@/src/lib/features/specialist/specialistsSlice";
import { setBusinesses } from "@/src/lib/features/businesses/businessesSlice";
import { useState, useEffect } from "react";

export default function SearchInput() {
  const dispatch = useAppDispatch();
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  // 初始加载所有数据
  useEffect(() => {
    performSearch("");
  }, []);

  const performSearch = async (searchQuery) => {
    console.log('performSearch called with:', searchQuery);
    setLoading(true);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('API results:', data);
      
      // 直接设置整个列表，替换现有数据
      dispatch(setBusinesses(data.businesses || []));
      dispatch(setSpecialists(data.specialists || []));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInput = (e) => {
    const newKeywords = e.target.value;
    setKeywords(newKeywords);
    
    // 保存关键词到 filter
    dispatch(setKeywordsFilter({ keywords: newKeywords }));
    
    // 调用 API 搜索
    if (newKeywords.trim().length >= 2 || newKeywords.trim().length === 0) {
      performSearch(newKeywords);
    }
  };

  return (
    <Input
      classNames={{
        label: "text-black/50 dark:text-white/90",
        input: [
          "bg-transparent",
          "border-0",
          "focus:outline-none",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          "focus:ring-offset-0 focus:ring-0",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "shadow-xl",
          "bg-default-200/50",
          "dark:bg-default/60",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focus=true]:bg-default-200/50",
          "dark:group-data-[focus=true]:bg-default/60",
          "!cursor-text",
        ],
      }}
      placeholder="Type to search..."
      size="sm"
      startContent={<SearchIcon size={18} />}
      type="search"
      value={keywords}
      onChange={handleChangeInput}
    />
  );
}
