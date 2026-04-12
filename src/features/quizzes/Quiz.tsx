import { useEffect } from "react";
import { useQuizzes } from "../../contexts/QuizzesContext.js";
import Button from "../../ui/Button";
import { useLoaderData, useSearchParams } from "react-router";
import { fetchQuiz } from "@/api/supabaseApi.js";

export default function Quiz() {
  const data = useLoaderData();
  const { status, currentQuiz, dispatch } = useQuizzes();

  useEffect(() => {
    function loadCurrentQuiz() {
      dispatch({ type: "setCurrentQuiz", payload: data });
    }

    loadCurrentQuiz();
  }, [data, dispatch]);

  return (
    <div className=" flex justify-between px-4 py-10">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-bold">{currentQuiz?.title}</h3>
        <p className="text-sm">{currentQuiz?.description}</p>
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

export async function loader({ params }) {
  const { quizId } = params;

  const data = await fetchQuiz(quizId);

  return data;
}
