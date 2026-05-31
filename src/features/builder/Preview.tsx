import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAutoSaveQuiz } from "../../hooks/useAutoSave"
import BuilderSkeleton from "@/skeletons/BuilderSkeleton";
import Button from "@/ui/Button";
import { useBuilder } from "@/store/builderStore";

export default function Preview() {
  const { quizId } = useParams();
  const [curQuestion, setCurQuestion] = useState(0)

  const {
    isLoading,
    status,
    currentQuiz,
    handleNumOfQuizzes,
    handleNewQuiz,
    handleGetQuiz,
    dispatch: builderDispatch,
  } = useBuilder();


  const isFirst = curQuestion === 0
  const isLast = currentQuiz.questions.length - 1 === curQuestion


  // Loading quiz draft
  const onRestoreAction = (quiz) =>
    builderDispatch({ type: "setCurrentQuiz", payload: quiz });

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
          styles={"alternate"}
          additionalStyles={`px-4 py-1.5 ${
            isFirst ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={handlePreviousQuestion}>
          Anterior
        </Button>

        <Button
          styles={"standard"}
          additionalStyles={`px-4 py-1.5 ${
            isLast ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={handleNextQuestion}>
          Próxima
        </Button>
      </footer>
    </div>
  );
}



