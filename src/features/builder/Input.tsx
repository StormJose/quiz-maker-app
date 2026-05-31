import { ReactNode, useState } from "react";
import ButtonDelete from "./ButtonDelete";
import AnimatedCheckbox from "@/components/ui/checkbox";
import { Answer } from "@/types/answers";
import toast from "react-hot-toast";
import { useBuilder } from "@/store/builderStore";


interface InputProps {
  item: Answer;
  active: boolean;
  listeners: () => void
}

// TO DO: Apply drag n' drop functionality to the answers
export default function Input({ item, active, listeners }: InputProps) {
  const { curQuestion, updateQuestion, handleDeleteAnswer, setCorrectAnswer } = useBuilder();
  const [input, setInput] = useState<string>(item.content ?? "");

  function handleChangeAnswer(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleConfirmChanges() {
    if (!curQuestion) return

    const updatedAnswers = curQuestion?.answers.map((answer) =>
      answer.answerId === item.answerId
        ? { ...answer, content: input }
        : answer,
      );
      
      const updatedQuestion = {
        ...curQuestion,
        answers: updatedAnswers,
      };

    updateQuestion(updatedQuestion)
  }

  function handleCorrectAnswer(answer: Answer) {

    if (!curQuestion) return
    const updatedAnswers = curQuestion?.answers.map((a: Answer) =>
      answer.answerId === a.answerId && a.correctAnswer === false
        ? { ...a, correctAnswer: true }
        : { ...a, correctAnswer: false },
    );

    const payload = {
      questionId: curQuestion?.questionId,
      answers: updatedAnswers,
    };
    console.log(payload.answers);

    setCorrectAnswer(payload)
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