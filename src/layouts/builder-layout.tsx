
import { Outlet, Params, useLoaderData, useNavigate, useNavigation } from "react-router"
import { fetchNumOfQuizzes, fetchQuiz, fetchQuizzes } from "@/api/supabaseApi";
import Sidebar from "./sidebar"
import { useBuilder } from "@/store/builderStore"
import { useQuizzes } from "@/store/quizzesStore";
import { useWarningDialog } from "@/hooks/useWarningDialog";
import { useEffect } from "react";
import BuilderSkeleton from "@/skeletons/BuilderSkeleton";
import { QuizItemSkeleton } from "@/skeletons/quiz-item-skeleton";
import { getCurrentUser } from "@/auth/auth";


export default function BuilderLayout() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { existingQuiz, quizzes, limitReached } = useLoaderData();
  const { openDialog } = useQuizzes();
  const { status, setCurrentQuiz} = useBuilder();

  const { Dialog } = useWarningDialog();

  function handleGoBack() {
    navigate("/");
  }

  useEffect(() => {
    if (limitReached) {
      openDialog({
        handler: handleGoBack,
        dialogLabel: "Limite atingido",
        dialogMessage:
          "Você está no limite de rascunhos. Caso deseje criar um novo Quiz, publique pelo menos um dos rascunhos existentes.",
      });
      return;
    }

    setCurrentQuiz(existingQuiz, quizzes?.length)
      
  }, [existingQuiz?.quizId]);

  if (limitReached) return <div>{Dialog};</div>;
 
  if (status !== "ready") return <BuilderSkeleton />;

  return (
    <div
      className="grid-cols-[auto_2fr] border-[1.55px] border-secondary shadow-2xl shadow-secondary px-6 py-8 rounded-2xl self-center
        grid w-full
    ">
      <div className=" mb-4 border-r-[1.55px] pr-4 flex flex-col gap-4">
        <Sidebar />
      </div>
      <div className=" lg:max-w-full pl-4">
        {navigation.state === "loading" ? (
          <div>
            <QuizItemSkeleton />
          </div>
        ) : (
      
          <Outlet />
        )}
      </div>
      {Dialog}
    </div>
  );
}

export async function editQuizLoader({ params }) {
  const { quizId } = params;
  const { user } = await getCurrentUser();

  // quiz
  const quizzes = user ? await fetchQuizzes(user?.id) : null
  const existingQuiz = await fetchQuiz(quizId);

  return {
    existingQuiz,
    quizzes,
  };
}

export async function newQuizLoader() {
  // auth
  const { user } = await getCurrentUser();
  // quiz
  const quizzes = user ? await fetchQuizzes(user?.id) : null
  const numDrafts = 
    await fetchNumOfQuizzes({column: "published", value:  false}) ?? 0;

  if (numDrafts >= 3) {
    return { numDrafts, existingQuiz: null, limitReached: true };
  }

  return { numDrafts, quizzes, limitReached: false };
}
