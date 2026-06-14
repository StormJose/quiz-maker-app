
import { Link, Outlet, useLoaderData, useNavigate, useNavigation } from "react-router"
import { fetchNumOfQuizzes, fetchQuiz, fetchQuizzes } from "@/api/supabaseApi";
import Sidebar from "./sidebar"
import { useBuilder } from "@/store/builderStore"
import { useQuizzes } from "@/store/quizzesStore";
import { useWarningDialog } from "@/hooks/useWarningDialog";
import { useEffect } from "react";
import BuilderSkeleton from "@/skeletons/BuilderSkeleton";
import { QuizItemSkeleton } from "@/skeletons/quiz-item-skeleton";
import { getCurrentUser } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import WarningDialog from "@/ui/dialogs/warning-dialog";


export default function BuilderLayout() {
  const navigation = useNavigation();
  const { existingQuiz, quizzes, limitReached } = useLoaderData();
  const { status, setCurrentQuiz} = useBuilder();

   const { dispatch } = useWarningDialog()

  useEffect(() => {
    if (limitReached) {
      console.log("passed")
      dispatch({
        type: "openDialog",
        payload: {
          dialogLabel: "Limite atingido",
          dialogMessage:
          "Você está no limite de rascunhos. Caso deseje criar um novo Quiz, publique pelo menos um dos rascunhos existentes.",
        }
      });
      return;
    }
   
    setCurrentQuiz(existingQuiz, quizzes?.length)
      
  }, [existingQuiz?.quizId]);
  
  if (limitReached) return 
 
  if (status !== "ready") return <BuilderSkeleton />;

  return (
    <div >
      <div className="mb-4">
      <Button intent={"alternate"} size={"lg"}>
            <Link to={"/quizzes"} >
              Voltar para Quizzes
            </Link>
            </Button>
      </div>
  
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
    </div>
    </div>
  );
}

export async function editQuizLoader({ params }: {params: {quizId: string}}) {
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
