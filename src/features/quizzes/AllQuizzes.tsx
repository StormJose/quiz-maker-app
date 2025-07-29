import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useQuizzes } from "../../contexts/QuizzesContext";
import QuizItem from "./QuizItem";
import Button from "../../ui/Button";
import Loader from "../../ui/Loader";

export default function AllQuizzes() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const { getUserQuizzes, quizzes, status, error } = useQuizzes();

  useEffect(() => {
    async function loadQuizzes() {
      if (currentUser?.id) await getUserQuizzes(currentUser.id);
    }

    loadQuizzes();
  }, [currentUser]);

  if (status === "loading") return <Loader />;

  return (
    <div className="flex flex-col px-4 mx-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Quizzes</h2>
      </div>

      {quizzes.length === 0 && status !== "loading" && (
        <div className="flex flex-col gap-5 items-start">
          <h3>Nenhum quiz disponível. Que tal criar o seu próprio?</h3>
          <Button styles={"standard"} onClick={() => navigate("/quiz/new")}>
            Criar quiz
          </Button>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {quizzes?.map((quiz: object) => (
          <QuizItem key={quiz.id} quiz={quiz} />
        ))}
      </ul>
    </div>
  );
}
