import { useNavigate } from "react-router";
import { useQuizzes } from "../../contexts/QuizzesContext";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";

export default function QuizNav() {
  const { currentQuiz, curQuestion, selectedAnswers } = useQuizzes();

  const navigate = useNavigate();

  function handleGoToQuestion(id) {
    navigate(`/quizzes/${currentQuiz?.id}/questions/${id}`);
  }
  return (
    <div className=" text-center mb-auto border-secondary border-2 py-4 px-3 rounded-xl bg-white">
      <ul className="flex flex-wrap justify-center gap-2 ">
        {currentQuiz?.questions
          ?.sort((a, b) => a.order - b.order)
          .map((question, i) => {
            const isAnswered =
              selectedAnswers.find(
                (answer) => answer.questionId === question.id
              ) && true;

            return (
              <Button
                type={"button"}
                onClick={() => handleGoToQuestion(question.id)}>
                <li key={i} className="relative">
                  {/* Left line — skip on first */}

                  {/* {i !== 0 && (
                  <div
                    className={`absolute left-[-73%] top-1/2 w-3/4 h-0.5 ${
                      i <= curQuestionIndex ? "bg-main" : "bg-grey"
                    } z-0 transform -translate-y-1/2`}
                  />
                )} */}

                  {/* Right line — skip on last */}
                  {/* {i !== currentQuiz?.questions.length - 1 && (
                  <div
                    className={`absolute right-[-73%] top-1/2 w-3/4 h-0.5 ${
                      i <= curQuestionIndex ? "bg-main" : "bg-grey"
                    } z-0 transform -translate-y-1/2`}
                  />
                )} */}

                  <div
                    className={`
                    ${isAnswered ? "bg-main text-white" : ""}
                    ${
                      isAnswered && curQuestion?.id === question?.id
                        ? " border-[1.55px]"
                        : ""
                    }
                    ${
                      curQuestion?.id === question?.id
                        ? " border-[1.55px] border-blue-500"
                        : ""
                    } border-[1.55px] w-10 h-10 p-2 rounded-[50%]  
                       
                        relative 
                       `}>
                    {i + 1}
                  </div>
                </li>
              </Button>
            );
          })}
      </ul>
    </div>
  );
}
