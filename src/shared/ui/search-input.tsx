"use client";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder = "",
  delay = 300,
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const debouncedOnChange = useMemo(
    () =>
      debounce((nextValue: string) => {
        onChangeRef.current(nextValue);
      }, delay),
    [delay],
  );

  useEffect(() => {
    if (value !== inputValue) setInputValue(value);
    debouncedOnChange.cancel();
  }, [value, debouncedOnChange]);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={inputValue}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;

        setInputValue(nextValue);
        debouncedOnChange(nextValue);
      }}
    />
  );
};
