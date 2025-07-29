import { useEffect } from "react";
import { fetchQuiz } from "../../api/supabaseApi.js";
import { useQuizzes } from "../../contexts/QuizzesContext.js";
import Button from "../../ui/Button";
import { useLoaderData } from "react-router";

export default function Quiz() {
  const { dispatch } = useQuizzes();

  const { data } = useLoaderData();

  useEffect(() => {
    function loadCurrentQuiz() {
      dispatch({ type: "setCurrentQuiz", payload: data });
    }

    loadCurrentQuiz();
  }, [data, dispatch]);

  if (Object.entries(data).length === 0)
    return <div>Nenhum quiz encontrado</div>;

  return (
    <div className="flex justify-between px-4 py-10">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-bold">{data?.title}</h3>
        <p className="text-sm">{data?.description}</p>
      </div>
      <div>
        <Button
          onClick={() => dispatch({ type: "startQuiz" })}
          styles={"standard"}
          to={`questions/0`}>
          Iniciar quiz
        </Button>
      </div>
    </div>
  );
}

export function loader({ params }) {
  const { quizId } = params;

  const data = fetchQuiz(quizId);

  return data;
}
