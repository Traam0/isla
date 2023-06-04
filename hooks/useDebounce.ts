import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timeOutRefID = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(timeOutRefID);
    };
  }, [value, delay]);

  return debounceValue;
}
