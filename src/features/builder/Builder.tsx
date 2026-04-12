import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAutoSaveQuiz } from "../../hooks/useAutoSave"
import { useQuizzes } from "../../contexts/QuizzesContext";
import { useBuilder } from "../../contexts/BuilderContext";
import QuestionsTrack from "./QuestionsTrack";
import Question from "./Question";
import QuizInformation from "./quiz-info";
import Toolbox from "./toolbox";
import BuilderSkeleton from "@/skeletons/BuilderSkeleton";
import { Toaster } from "react-hot-toast";
import { useWarningDialog } from "@/hooks/useWarningDialog";

export default function Builder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();

  const { Dialog } = useWarningDialog();
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
    status,
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

  if (isLoading) return <BuilderSkeleton />;

  return (
    <div className="px-4 flex flex-col gap-12">
      {Dialog}
      <form>
        <QuizInformation />
        <div className="ml-12 my-4">
          <QuestionsTrack />
        </div>

        <Toolbox />

        <Question />
      </form>
    </div>
  );
}



