import React, { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type anyReturnFunction = (() => any)

export interface ISavingTimer {
  setToExecute: (func: undefined | anyReturnFunction) => void;
  setTime: (newTime: number) => void;
  isActive: boolean;
  currentCount: number;
}

/**
 * This function is hook-like but isn't a hook.
 * It only looks like a hook to match React-like development, but it could easily be class.
 * 
 * Linked issue: [Saving timer #1](https://github.com/Ruberoni/notes-project/issues/1)
 * 
 * **Feature description**
 *
 * A Saving timer for the things of Notes that are usually the most updated: title and body.
 *
 * The Saving timer will control when to execute the server request to update a Note. **_Important_**: this only applies to the request to update a Note.
 * 
 * - The control in made by a delay time to execute a request.
 *  - The request will be delayed until the timer is zero.
 *  - If another request is made but there were another one already waiting for the timer, the older request will be replaced with the new one.
 */
export default function SavingTimer(_initialTime = 4): ISavingTimer {
  
  const [isActive, setIsActive] = useState(false)
  const [initialTime, setTime] = useState(_initialTime)
  const [currentCount, setCurrentCount] = useState(initialTime)
  const [toExecute, _setToExecute] = useState<{state: boolean, func?: anyReturnFunction}>({state: false })
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>()

  const setToExecute = (func: typeof toExecute.func) => {
    _setToExecute(({ state }) => ({state: !state, func}))
  }

  const startTimer = () => {
    console.log("[SavingTimer][startTimer] starting timer")
    const _intervalID = setInterval(handleCount, 1000)
    setIntervalId(_intervalID)
  }

  const handleCount = () => {
    setCurrentCount(current => (current - 1))
  }
  
  React.useEffect(() => {
    console.log("[SavingTimer] intervalId:", intervalId)
    if (currentCount === 0) {
      console.log("[SavingTimer] Executing 'toExecute'")
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

  React.useEffect(() => {
    console.log("[SavingTimer] Changing 'toExecute'")
    if(!intervalId) {
      startTimer()
      setIsActive(true)
    }
  }, [toExecute])

  return { setToExecute, setTime, isActive, currentCount };
}

/**
 * It onlt exist if I want to stop using the original SavingTimer.
 */
export class SavingTimerClass {
  protected time = 2000
  protected _toExecute?: anyReturnFunction
  isActive = false

  constructor(time = 2000, toExecute?: anyReturnFunction) {
    this.time = time
    this.toExecute = toExecute
  }

  set toExecute(toExecute: undefined | anyReturnFunction) {
    console.log("[SavingTimer2][set][toExecute]")
    this._toExecute = toExecute
    this._toExecute && this.startTimer()
  }

  startTimer(): void {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    setTimeout(() => {
      this._toExecute?.();
      this.isActive = false;
    }, this.time);
  }
}

export function SavingTimerTest(): React.ReactElement {
  const savingTimer = SavingTimer(2000);
  const [value, setValue] = useState(0)

  React.useEffect(() => {
    console.log("[SavingTimerTest] savingTimer.isActive:", savingTimer.isActive)
  }, [savingTimer.isActive])

  const onClick = () => {
    savingTimer.setToExecute(() => console.log("Executed!"));
    // savingTimer.toExecute = () => console.log("Executed!")
  };

  const onClick2 = () => {
    savingTimer.setToExecute(() => console.log("Executed number 2!"));
    // savingTimer.toExecute = () => console.log("Executed number 2!")

  };

  return (
    <>
      <button onClick={onClick}>SavingTimerTest</button>
      <button onClick={onClick2}>SavingTimerTest 2</button>
      <input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))}/>
      <button onClick={() => {savingTimer.setTime(value)}}>Change time</button>
    </>
  );
}
