import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Answers from "./Answers";
import { useBuilder } from "../../contexts/BuilderContext";
import Loader from "../../ui/Loader";

export default function Question() {
  
  
  const {
    curQuestion,
    currentQuiz,
    dispatch: builderDispatch,
    customScore,
  } = useBuilder();
  const [description, setDescription] = useState(curQuestion.description);

  // if (!currentQuiz.questions.length) return <p>Erro ao carregar a pergunta :/</p>;

  useEffect(() => {
    setDescription(curQuestion.description);
  }, [curQuestion]);

  async function handleChangeDescription(e: string) {
    setDescription(e.target.value);
  }

  async function handleConfirmDescription() {
    const updatedQuestion = {
      ...curQuestion,
      description,
    };

    await builderDispatch({ type: "updateQuestion", payload: updatedQuestion });
  }

  return (
    <div>
      <div className="flex justify-between mt-6 mb-12">
        <h2 className="text-main">Pergunta {curQuestion?.id} </h2>
      </div>

      <textarea
        name={`${curQuestion.id}#description`}
        className="w-full border-[1px] p-2 border-gray-300 rounded-md focus-visible:outline-0 "
        onChange={(e) => handleChangeDescription(e)}
        onBlur={handleConfirmDescription}
        value={description}></textarea>

      {customScore && (
        <div className="my-4">
          <label className="flex gap-2">
            Pontos
            <input className="border-[1.88px] rounded-lg border-gray-300 self-start" />
          </label>
        </div>
      )}
      <Answers />
    </div>
  );
}
