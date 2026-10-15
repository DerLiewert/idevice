"use client";

import debounce from "lodash.debounce";
import { useMemo, useEffect, useState } from "react";
import { Input } from "@/shared/ui";
import { useSearchStore } from "../model";
import { cn } from "cn";

type SearchProps = {
  className?: string;
};

export const Search = ({ className }: SearchProps) => {
  const { value: searchValue, setSearchValue } = useSearchStore();
  const [inputValue, setInputValue] = useState(searchValue);

  const debounceSetValue = useMemo(
    () => debounce((val: string) => setSearchValue(val), 300),
    [setSearchValue],
  );

  useEffect(() => {
    return () => {
      debounceSetValue.cancel();
    };
  }, [debounceSetValue]);

  return (
    <div className={cn("flex", className)}>
      <Input
        type="search"
        placeholder="Введите название категории"
        value={inputValue}
        onChange={(e) => {
          const value = e.currentTarget.value;
          setInputValue(value);
          debounceSetValue(value);
        }}
      />
    </div>
  );
};
