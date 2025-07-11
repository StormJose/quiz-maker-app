
import { useState } from 'react';
import Button from '../../ui/Button';
import Timer from './Timer';
import { useNavigate } from 'react-router';
import { useQuizzes } from '@/contexts/QuizzesContext';




export default function QuizMenu() {


    const { dispatch, currentQuiz } = useQuizzes();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    function handleOpenMenu() {
      console.log("click");
      setOpen((cur) => (cur === open ? !open : open));
    }

    function handleLeaveQuiz () {

      navigate(`/quizzes/${currentQuiz.id}`)
  

    }
  return (
    <div className="flex items-center gap-2">
      <Button styles={"alternate"} onClick={handleOpenMenu}>
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-dark">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-dark">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        )}
      </Button>

      {/* Menu Options */}

      <div
        className="border-[1.55px] border-grey inset-shadow-sm w-full rounded-md  menu-content"
        data-state={!open && "close"}>
        <Button onClick={handleLeaveQuiz} styles={"cancel"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </Button>
      </div>

      <Timer />
    </div>
  );
}
