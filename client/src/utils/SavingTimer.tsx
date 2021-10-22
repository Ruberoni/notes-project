import React, { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type anyReturnFunction = (() => any)

export interface SavingTimer {
  setToExecute: (func: undefined | anyReturnFunction) => void;
  setTime: (newTime: number) => void;
  isActive: boolean;
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
// Look for a workaround of this function but with setInterval
export default function SavingTimer(Time = 2000, ToExecute?: anyReturnFunction): SavingTimer {
  let time = Time;
  function setTime(newTime: number) {
    time = newTime;
  }
  /* let isActive = false;
  const setIsActive = (val: boolean) => {
    isActive = val;
  }; */
  const [isActive, setIsActive] = useState(false)
  // let toExecute: {state: boolean, func: undefined | anyReturnFunction} = {state: false, func: undefined}
  const [toExecute, _setToExecute] = useState<{state: boolean, func: undefined | anyReturnFunction}>({state: false, func: undefined})
  // const [changedToExecute, setChangedToExecute] = useState<{state: boolean, func: undefined | anyReturnFunction}>({state: false, func: undefined})
  // const [_toExecute, _setToExecute] = useState<undefined | anyReturnFunction>(ToExecute)

  const setToExecute = (func: typeof toExecute.func) => {
    // _setToExecute(func)
    // toExecute = func
    // setChangedToExecute(prev => ({state: !prev.state, func}))
    _setToExecute(prev => ({state: !prev.state, func}))
    startTimer();
  }

  React.useEffect(() => {
    console.log("Updated toExecute")
  }, [toExecute])

  // const toExecute = React.useMemo(() => _toExecute, [changedToExecute])
  /* React.useEffect(() => {
    console.log("changedToExecute!")
    // toExecute = changedToExecute.func
  }, [changedToExecute]) */
  /* const setToExecute = (func: typeof toExecute) => {
    // toExecute = func;
    startTimer();
  }; */

  function startTimer() {
    if (isActive) {
      console.log(
        "[SavingTimer] Attempting to start a timer but there's already an active timer."
      );
      return;
    }
    console.log("[SavingTimer] Starting timer.");
    setIsActive(true);
    setTimeout(() => {
      toExecute.func?.();
      setIsActive(false);
      console.log("[SavingTimer] Finishing timer.");
    }, time);
  }
  return { setToExecute, setTime, isActive };
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
