import { useRef, useEffect, useState } from 'react'

export type useInterval = (cb: ((...args: any) => any), delay: number, pivot: any) => void

/**
 * Ideas:
 * - useInterval stack, where when the first useInterval ends, the next starts
 * - various useInterval simultaneo (i like this), a new interval every time sometime is triggered (maybe a prop is modified), but keep alive older intervals 
 * @reference https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
const _useNotesSavingInterval: useInterval = (callback, delay, pivot) => {
  const savedCallback = useRef<typeof callback>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /*
  useEffect(() => {
    // propmtNewInterval
  }, [reactiveProp])
  */

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, pivot]);
}

type anyReturnFunction = (() => any)

export interface ISavingTimer {
  setToExecute: (func: undefined | anyReturnFunction) => void;
  setTime: (newTime: number) => void;
  isActive: boolean;
  currentCount: number;
}

const useNotesSavingInterval = (_initialTime = 4): ISavingTimer => {
  
  const [isActive, setIsActive] = useState(false)
  const [initialTime, setTime] = useState(_initialTime)
  const [currentCount, setCurrentCount] = useState(initialTime)
  const [toExecute, _setToExecute] = useState<{state: boolean, func?: anyReturnFunction}>({state: false })
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>()

  const setToExecute = (func: typeof toExecute.func) => {
    _setToExecute(({ state }) => ({state: !state, func}))
  }

  const startTimer = () => {
    // console.log("[SavingTimer][startTimer] starting timer")
    const _intervalID = setInterval(handleCount, 1000)
    setIntervalId(_intervalID)
  }

  const handleCount = () => {
    setCurrentCount(current => (current - 1))
  }
  
  useEffect(() => {
    // console.log("[SavingTimer] intervalId:", intervalId)
    if (currentCount === 0) {
      // console.log("[SavingTimer] Executing 'toExecute'")
      setIsActive(false)
      // execute function
      toExecute.func?.()
      // clear interval
      intervalId && clearInterval(intervalId)
      setIntervalId(undefined)
      // reset current count
      setCurrentCount(initialTime)
    }
  }, [currentCount])

  useEffect(() => {
    // console.log("[SavingTimer] Changing 'toExecute'")
    if(!intervalId) {
      startTimer()
      setIsActive(true)
    }
  }, [toExecute])

  return { setToExecute, setTime, isActive, currentCount };
}

export default useNotesSavingInterval