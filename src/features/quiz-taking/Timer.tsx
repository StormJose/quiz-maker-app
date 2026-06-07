import { useEffect, useState } from "react";

export default function Timer({quizTime}: {quizTime: number}) {

  const [timerSeconds, setTimerSeconds] = useState(quizTime);


  const parseTimer = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
   } 

  useEffect(() => {

    let intervalId: string = null;
    const pausedTime = 0;
    function testTimer() {
    if (intervalId) return; 
      intervalId = setInterval(() => {
        setTimerSeconds((s) => s - 1)
      }, 1000);  
    }
    testTimer()

   return () => clearInterval(intervalId)
}, [timerSeconds])

  return (
    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-dark">
      {parseTimer(timerSeconds)}
    </div>
  );
}