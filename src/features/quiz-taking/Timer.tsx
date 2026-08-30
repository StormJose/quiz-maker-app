import { useQuizzes } from "@/store/quizzesStore";
import { useEffect } from "react";

export default function Timer() {

  const { tick, timer } = useQuizzes()
  const parseTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
   }

  useEffect(() => {

    let intervalId: ReturnType<typeof setInterval> | null = null;
    function testTimer() {
    if (intervalId) return;
      intervalId = setInterval(() => {
        tick()
      }, 1000);
    }
    testTimer()

   return () => clearInterval(intervalId ?? undefined)
}, [timer])

  return (
    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-dark">
      {parseTimer(timer)}
    </div>
  );
}