import { Input } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";
import { useAppDispatch } from "@/lib/hooks";
import { updateSpecialistsFilter } from "@/lib/features/specialist/specialistsSlice";
import { useState } from "react";

export default function SearchInput() {
  const dispatch = useAppDispatch();
  const [keywords, setKeywords] = useState("");

  const handleChangeInput = (e) => {
    console.log("handleChangeInput");
    setKeywords(e.target.value);
    dispatch(updateSpecialistsFilter({ keywords: e.target.value }));
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
