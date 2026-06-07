import { useEffect, useState } from "react";
import { useBuilder } from "../../contexts/BuilderContext";
import Answers from "./Answers";

export default function Question() {
  const { curQuestion, currentQuiz, dispatch: builderDispatch } = useBuilder();
  const [description, setDescription] = useState(
    curQuestion?.description ?? "",
  );
  const [pointsRewarded, setPointsRewarded] = useState(
    curQuestion.points_rewarded,
  );

  useEffect(() => {
    setDescription(curQuestion?.description);
    setPointsRewarded(curQuestion?.pointsRewarded);
  }, [curQuestion]);

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleConfirmDescription() {
    const updatedQuestion = {
      ...curQuestion,
      description,
    };

    builderDispatch({ type: "updateQuestion", payload: updatedQuestion });
  }

  function handleChangePoints(e) {
    setPointsRewarded(e.target.value);
  }

  function handleConfirmPoints() {
    const updatedQuestion = {
      ...curQuestion,
      points_rewarded: Number(pointsRewarded),
    };

    
  }

  return (
    <div>
      <div className="flex justify-between mt-6 mb-12">
        <h2 className="text-main">Pergunta {curQuestion?.id} </h2>
      </div>

      <textarea
        name={`${curQuestion.id}#description`}
        className="w-full border-[1px] p-2 border-gray-300 rounded-md focus-visible:outline-0 "
        onBlur={handleConfirmDescription}
        onChange={(e) => handleChangeDescription(e)}
        value={description}></textarea>

      {currentQuiz?.customScore && (
        <div className="my-4 flex items-center">
          <label className="flex gap-2 ">
            <p className="mt-1"> Pontos</p>
            <input
              className="pl-2 w-15 h-8 border-[1.88px] rounded-lg border-gray-300"
              type="number"
              onBlur={handleConfirmPoints}
              onChange={(e) => handleChangePoints(e)}
              name={`score-q-#${curQuestion.order}`}
              value={pointsRewarded ?? 0}
              min="1"
              max="3"
              step="1"></input>
          </label>
        </div>
      )}
      <Answers />
    </div>
  );
}
