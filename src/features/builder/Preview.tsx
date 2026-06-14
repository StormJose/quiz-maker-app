import { useState } from "react";
import { useParams } from "react-router";
import { useAutoSaveQuiz } from "../../hooks/useAutoSave"
import BuilderSkeleton from "@/skeletons/BuilderSkeleton";
import { useBuilder } from "@/store/builderStore";
import { Button } from "@/components/ui/button";

export default function Preview() {
  const { quizId } = useParams();
  const [curQuestion, setCurQuestion] = useState(0)

  const {
    isLoading,
    status,
    currentQuiz,
    setCurrentQuiz
  } = useBuilder();

  // Loading quiz draft
  const onRestoreAction = (quiz) =>
    setCurrentQuiz(quiz, null);

  const { draftStatus, savedDraft } = useAutoSaveQuiz(
    quizId,
    currentQuiz,
    onRestoreAction,
    status
  );

   function handleNextQuestion() {
    setCurQuestion(cur => cur + 1)
   }

   function handlePreviousQuestion() {
     setCurQuestion(cur => cur - 1)
   }

  function beforeUnloadHandler(e) {
    e.preventDefault();

    e.returnValue = true;
  }

  window.addEventListener("beforeunload", beforeUnloadHandler);

  if (currentQuiz === null) return <div>Erro ao carregar quiz</div>;

  if (isLoading) return <BuilderSkeleton/>


  return (
    <div className="px-4 flex flex-col gap-12">
      <div>

      <h3 className="mt-12 mb-auto text-center">
        {currentQuiz.questions[curQuestion]?.description}
      </h3>
      </div>
      <ul className="list-none flex flex-col gap-2 mt-12">

      {currentQuiz.questions[curQuestion]?.answers.map((answer) => (
        <li className="cursor-pointer px-2 py-4 rounded-xl">{answer.content}</li>
      ))}
      </ul>
      <footer className="flex justify-between px-4 py-8 mt-12 w-full border-t-[1.55px] border-grey bottom-0 rounded-xl">
        <Button
          intent={"alternate"}

          onClick={handlePreviousQuestion}>
          Anterior
        </Button>

        <Button
          intent={"standard"}
   
          onClick={handleNextQuestion}>
          Próxima
        </Button>
      </footer>
    </div>
  );
}



