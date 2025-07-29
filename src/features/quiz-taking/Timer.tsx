import { useEffect, useState } from 'react'
import { useQuizzes } from '../../contexts/QuizzesContext'

export default function Timer() {

    const { dispatch, timer } = useQuizzes();

    const mins = Math.floor(timer / 60);
    const secs = timer % 60;

    useEffect(() => {
      const id = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);

      return () => clearInterval(id);
    }, [dispatch]);

  return (
    <div className='flex items-center'>

    <div className="border-[1.88px] rounded-xl px-3 py-1 flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6 text-dark">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
      </svg>

      <p className="mt-[0.8px]">
        {mins}:{secs < 10 && '0'}{secs}
      </p>
    </div>

    </div>
  );
}
