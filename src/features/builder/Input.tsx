import { useEffect, useState } from "react";
import ButtonDelete from "./ButtonDelete";
import ButtonAdd from "./ButtonAdd";
import { useBuilder } from "../../contexts/BuilderContext";
import AnimatedCheckbox from "@/components/ui/checkbox";
import { Answer } from "@/types/answers";
import toast from "react-hot-toast";

// TO DO: Apply drag n' drop functionality to the answers
export default function Input({ item, active, listeners }) {
  const { curQuestion, handleDeleteAnswer, dispatch } = useBuilder();
  const [input, setInput] = useState<string>(item.content ?? "");

  // For now, it is not possible to undo the changes after the input loses focus because
  // the component wouldn't be able to save the changes.
  // useEffect(() => {
  //   setInput(item.content);
  // }, [input]);

  function handleChangeAnswer(e) {
    setInput(e.target.value);
  }

  function handleConfirmChanges() {
    const updatedAnswers = curQuestion.answers.map((answer) =>
      answer.answerId === item.answerId
        ? { ...answer, content: input }
        : answer,
    );

    const updatedQuestion = {
      ...curQuestion,
      answers: updatedAnswers,
    };

    dispatch({ type: "updateQuestion", payload: updatedQuestion });
  }

  function handleCorrectAnswer(answer: Answer) {
    const updatedAnswers = curQuestion?.answers.map((a: Answer) =>
      answer.answerId === a.answerId && a.correctAnswer === false
        ? { ...a, correctAnswer: true }
        : { ...a, correctAnswer: false },
    );

    const payload = {
      questionId: curQuestion.questionId,
      answers: updatedAnswers,
    };
    console.log(payload.answers);

    dispatch({ type: "setCorrectAnswer", payload });
  }

  async function handleDelete(id: string) {
    try {
      await handleDeleteAnswer(id);
      toast.success("Resposta removida");
    } catch (error) {
      toast.error("Erro ao excluir resposta");
    }
  }

  if (curQuestion?.type === "true_false")
    return (
      <div className="flex items-center">
        <input value={input} disabled />
        <AnimatedCheckbox
          checked={item.correctAnswer}
          onClick={() => handleCorrectAnswer(item)}
        />
      </div>
    );

  return (
    <li className=" flex gap-2 items-center">
      <button
        className={"draggable-btn cursor-grab"}
        type={"button"}
        {...listeners}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <label className="relative">
        <input
          className="border-[1.5px] w-full rounded-2xl border-gray-200 px-4 py-2 focus:outline-gray-500 text-dark"
          name={`${item.answerId}#answer${item.order}`}
          onBlur={handleConfirmChanges}
          onChange={(e) => handleChangeAnswer(e)}
          value={input}
        />

        {/* <ButtonAdd onClick={() => handleConfirmChanges(item.answerId)} /> */}
      </label>

      <div className="flex items-center gap-4">
        <AnimatedCheckbox
          checked={item.correctAnswer}
          onClick={() => handleCorrectAnswer(item)}
        />
        <ButtonDelete
          onClick={() => handleDelete(item.answerId)}
          disabled={item.correctAnswer}
        />
      </div>
    </li>
  );
}