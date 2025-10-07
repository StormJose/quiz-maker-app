import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAutoSaveQuiz } from "../../hooks/useAutoSave"
import { useQuizzes } from "../../contexts/QuizzesContext";
import { useBuilder } from "../../contexts/BuilderContext";
import toast, { Toaster, useToaster } from "react-hot-toast";
import QuestionsTrack from "./QuestionsTrack";
import Question from "./Question";
import QuizInformation from "./quiz-info";
import Toolbox from "./toolbox";

export default function Builder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();

  const curRouteSegment = location.pathname
    .split("/")
    .filter((segment) => segment === "edit")[0];

  const {
    isLoading: quizzesLoading,
    quizzes,
    dispatch: quizzesDispatch,
  } = useQuizzes();

  const {
    isLoading,
    status,
    title,
    currentQuiz,
    handleNumOfQuizzes,
    handleNewQuiz,
    handleGetQuiz,
    dispatch: builderDispatch,
  } = useBuilder();

  // Loading quiz draft
  const onRestoreAction = (quiz) =>
    builderDispatch({ type: "setCurrentQuiz", payload: quiz });

  const { draftStatus, savedDraft } = useAutoSaveQuiz(
    quizId,
    currentQuiz,
    onRestoreAction,
    status
  );

  function handleGoBack() {
    navigate("/");
  }

  useEffect(() => {
    async function loadQuizData() {
      const numDrafts = await handleNumOfQuizzes({
        column: "published",
        value: false,
      });

      console.log(numDrafts);
      try {
        // New Quiz
        if (!quizId && numDrafts < 3) await handleNewQuiz();
        // // Edit quiz
        else if (quizId) await handleGetQuiz(quizId);
        // Limit of drafts
        else if (numDrafts === 3)
          quizzesDispatch({
            type: "setDialogOpen",
            payload: {
              handler: handleGoBack,
              dialogLabel: "Limite atingido",
              dialogMessage:
                "Você está no limite de rascunhos. Caso deseje criar um novo Quiz, publique pelo menos um dos rascunhos existentes.",
            },
          });
      } catch (error) {
        console.error(error);
      }
    }

    loadQuizData();
  }, []);

  function beforeUnloadHandler(e) {
    e.preventDefault();

    e.returnValue = true;
  }

  window.addEventListener("beforeunload", beforeUnloadHandler);

  if (currentQuiz === null) return <div>Erro ao carregar quiz</div>;

  return (
    <div className="px-4 flex flex-col gap-12">
      <form>
        <QuizInformation />
        <div className="ml-12 my-4">
          <QuestionsTrack />
        </div>

        {/* <div className="flex justify-center gap-2">
          {curRouteSegment === "edit" && (
            <h4 className="flex items-center cursor-pointer gap-1.5 px-2 bg-amber-400 rounded-2xl text-center ">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
            </svg>
            
            <span className="pt-0.5 font-bold text-sm">Modo de edição</span>
            </h4>
            )}
            </div> */}

        <Toolbox />

        <Question />
        <Toaster position="bottom-right" />
      </form>
    </div>
  );
}



