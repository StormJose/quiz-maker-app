import { useNavigate } from "react-router";
import { useQuizzes } from "../../contexts/QuizzesContext";
import Button from "../../ui/Button";

export default function QuizNav() {
  const { currentQuiz, curQuestion, selectedAnswers } = useQuizzes();

  console.log(currentQuiz, curQuestion);

  const navigate = useNavigate();

  const curQuestionIndex = currentQuiz?.questions
    ?.map((_, i, arr) => (arr.at(i) === curQuestion ? i : ""))
    .join("");

  function handleGoToQuestion(index) {
    navigate(`/quizzes/${currentQuiz?.id}/questions/${index}`);
  }
  return (
    <div className=" text-center mb-auto">
      <ul className="flex justify-center gap-2 ">
        {currentQuiz?.questions?.map((question, i) => {
          const isAnswered =
            selectedAnswers.find(
              (answer) => answer.questionId === question.id
            ) && true;

          return (
            <Button type={"button"} onClick={() => handleGoToQuestion(i)}>
              <li key={i} className="relative">
                {/* Left line — skip on first */}

                {i !== 0 && (
                  <div
                    className={`absolute left-[-73%] top-1/2 w-3/4 h-0.5 ${
                      i <= curQuestionIndex ? "bg-main" : "bg-grey"
                    } z-0 transform -translate-y-1/2`}
                  />
                )}

                {/* Right line — skip on last */}
                {i !== currentQuiz?.questions.length - 1 && (
                  <div
                    className={`absolute right-[-73%] top-1/2 w-3/4 h-0.5 ${
                      i <= curQuestionIndex ? "bg-main" : "bg-grey"
                    } z-0 transform -translate-y-1/2`}
                  />
                )}

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
                    } border-[1.55px] py-3 px-5 rounded-[50%]  
                       
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
