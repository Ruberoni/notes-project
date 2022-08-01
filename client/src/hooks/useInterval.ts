import { useEffect, useRef } from 'react';

export type useInterval = (cb: ((...args: any) => any), delay: number) => void

const useInterval: useInterval = (callback, delay) => {
  const savedCallback = useRef<typeof callback>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      setTimeout(tick, delay);
      // return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval