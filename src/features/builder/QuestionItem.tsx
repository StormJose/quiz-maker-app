import { useEffect, useState } from "react";
import { Grip } from "lucide-react";
import { useBuilder } from "../../contexts/BuilderContext";
import Button from "../../ui/Button";

export default function QuestionItem({ item, onSelect, listeners, active }) {
  const { currentQuiz, curQuestion, dispatch } = useBuilder();

  const [numQuestions, setNumQuestions] = useState(
    currentQuiz?.questions.length
  );

  function handleSetQuestion() {
    dispatch({ type: "setCurQuestion", payload: item });
  }

  useEffect(() => {
    setNumQuestions(currentQuiz?.questions.length);
    const newestQuestion = currentQuiz?.questions
      .slice()
      .sort((a, b) => b.id - a.id)[0];

    if (numQuestions > currentQuiz?.questions.length) return;

    const highlightTimeout = function () {
      const questionItem = document.querySelector(
        `[question-item="${newestQuestion.id}"]`
      );

      questionItem?.classList.remove("border-gray-300");
      questionItem?.classList.add("border-blue-500");
      questionItem?.classList.add("text-blue-500");

      setTimeout(() => {
        questionItem?.classList.remove("border-blue-500");
        questionItem?.classList.remove("text-blue-500");
      }, 1500);
    };

    highlightTimeout();
  }, [currentQuiz]);

  return (
    <Button
      additionalStyles={" whitespace-nowrap"}
      type={"button"}
      onClick={handleSetQuestion}
      listeners={listeners}>
      <li
        key={item?.id}
        question-item={item?.id}
        className={`
        
          flex gap-2 px-4 py-2 rounded-md border-[1.5px]  transition-colors
          ${active ? "shadow-2xl border-2 backdrop-blur-lg" : ""}
          ${
            item?.id === curQuestion?.id
              ? " border-main text-main  font-semibold "
              : ""
          } 
          `}>
        <Grip width={12} />
        Pergunta {item?.order}
      </li>
    </Button>
  );
}
