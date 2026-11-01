"use client";
import { useState } from "react";
import { cn } from "cn";
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  Field,
  SearchInput,
  Button,
} from "@/shared/ui";
import { useSearchStore } from "../../model/search-store";
import { searchTypeOptions } from "../../config/constants";

export const SpecificationsSearch = ({ className }: { className?: string }) => {
  const { searchValues, setSearchValue, clearSearch } = useSearchStore();
  const [selectedType, setSelectedType] = useState(searchTypeOptions[0].value);

  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex gap-3">
        <p className="inline-flex h-8 items-center text-nowrap">Поиск по</p>
        <Field>
          <Select
            items={searchTypeOptions}
            value={selectedType}
            onValueChange={(type) => {
              if (!type) return;
              setSelectedType(type);
              setSearchValue(type, searchValues[type]);
            }}
          >
            <SelectTrigger className="min-w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {searchTypeOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <SearchInput
          value={searchValues[selectedType]}
          onChange={(value) => {
            setSearchValue(selectedType, value);
          }}
        />
      </Field>

      <Button
        variant="destructive"
        className="w-40"
        onClick={() => clearSearch()}
      >
        Очистить все
      </Button>
    </div>
  );
};
