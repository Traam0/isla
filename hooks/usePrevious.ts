import { useRef } from "react";

export function usePrevious<T>(value: T): T {
  const currentRef = useRef(value);
  const previousRef = useRef<T>(value);

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}
