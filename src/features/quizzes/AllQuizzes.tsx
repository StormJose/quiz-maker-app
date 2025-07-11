import { fetchQuizzes } from "../../api/quizApi.js";
import { useLoaderData, useNavigate } from "react-router";
import { useQuizzes } from "../../contexts/QuizzesContext";
import Button from "../../ui/Button";
import ConfirmAction from "../../ui/ConfirmAction";
import QuizItem from "./QuizItem";
import Loader from "../../ui/Loader";

export default function AllQuizzes() {
  const navigate = useNavigate();

  const { isLoading, error } = useQuizzes();


  const quizzes = useLoaderData();


  if (isLoading) return <Loader />;

  if (!Array.isArray(quizzes)) return null;

  return (
    <div className="flex flex-col px-4 mx-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Quizzes</h2>
      </div>

      {quizzes.length === 0 && (
        <div className="flex flex-col gap-5 items-start">
          <h3>Nenhum quiz disponível. Que tal criar o seu próprio?</h3>
          <Button styles={"standard"} onClick={() => navigate("/quiz/new")}>
            Criar quiz
          </Button>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {quizzes.map((quiz: string) => (
          <QuizItem key={quiz.id} quiz={quiz} />
        ))}
      </ul>

      <ConfirmAction />
    </div>
  );
}

export async function loader() {

  const quizzes = await fetchQuizzes();


  return quizzes

}
