import { fetchQuiz } from "../../api/quizApi.js";
import { useLoaderData } from "react-router"
import { useEffect } from "react";
import { useQuizzes } from "../../contexts/QuizzesContext.js";
import Button from "../../ui/Button";


export default function Quiz() {

  const quiz = useLoaderData();

  const { dispatch } = useQuizzes();

  useEffect(() => {
      if (quiz) {
        dispatch({type: "setCurrentQuiz", payload: quiz})
      }

  }, [dispatch, quiz])


  if (Object.entries(quiz).length === 0) return <div>Nenhum quiz encontrado</div>

  return (
    <div className="flex justify-between px-4 py-10">
        <div className="flex flex-col gap-1.5">
            <h3 className="font-bold">
                {quiz?.title}
            </h3>
            <p className="text-sm">{quiz?.description}</p>
        </div>
        <div>

          
        <Button styles={"standard"} to={`questions/0`} >Iniciar quiz</Button>
        </div>
    </div>
  )
}


export async function loader({params}) {
  const quiz = await fetchQuiz(params.quizId);

  return quiz[0]
}