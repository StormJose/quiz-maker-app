
import { Outlet } from "react-router"
import Sidebar from "./sidebar"
import { useBuilder } from "@/store/builderStore"
import Spinner from "@/ui/Spinner";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import Button from "@/ui/Button";

export default function BuilderLayout() {
  const { quizId } = useParams();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { existingQuiz, quizzesData, limitReached } = useLoaderData();
  const { status: quizzesStatus, dispatch: quizzesDispatch } = useQuizzes();
  const { currentQuiz, dispatch: builderDispatch } = useBuilder();

  const { Dialog } = useWarningDialog();

  function handleGoBack() {
    navigate("/");
  }

  useEffect(() => {
    if (limitReached) {
      quizzesDispatch({
        type: "setDialogOpen",
        payload: {
          handler: handleGoBack,
          dialogLabel: "Limite atingido",
          dialogMessage:
            "Você está no limite de rascunhos. Caso deseje criar um novo Quiz, publique pelo menos um dos rascunhos existentes.",
        },
      });
      return;
    }
    const action = existingQuiz
      ? { type: "setCurrentQuiz", payload: existingQuiz }
      : { type: "setNewQuiz", payload: quizzesData?.length };
    builderDispatch(action);
  }, [existingQuiz]);

  const isReady = existingQuiz
    ? currentQuiz?.quizId === existingQuiz.quizId
    : currentQuiz?.quizId != null;

  if (limitReached) return <div>{Dialog};</div>;

  if (!isReady) return <BuilderSkeleton />;

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

  // quiz
  const existingQuiz = await fetchQuiz(quizId);

  return {
    existingQuiz,
  };
}

export async function newQuizLoader() {
  // auth
  const session = await getCurrentUser();
  // quiz
  const numDrafts =
    (await fetchNumOfQuizzes({
      column: "published",
      value: false,
    })) ?? 0;
  if (numDrafts >= 3) {
    return { numDrafts, existingQuiz: null, limitReached: true };
  }

  const quizzesData = await fetchQuizzes(session.user.id);

  return { numDrafts, quizzesData, limitReached: false };
}
