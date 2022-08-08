import { useEffect, useRef } from "react";

/**
 * When the component that calls this hook re-renders, it will return the previous value of `value`
 */
const usePrevious = <T>(value: T, initialValue: T): T => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious