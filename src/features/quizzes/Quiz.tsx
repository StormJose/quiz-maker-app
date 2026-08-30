import { useEffect } from "react";
import { useQuizzes } from "../../store/quizzesStore";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { fetchQuiz } from "@/api/supabaseApi.js";
import { Button } from "@/components/ui/button";
import { QuizItemSkeleton } from "@/skeletons/quiz-item-skeleton";
import { Heading } from "@/ui/Heading";

export default function Quiz() {
  const quiz = useLoaderData();
  const { status, currentQuiz, setCurrentQuiz, startQuiz } = useQuizzes();

  useEffect(() => {
    setCurrentQuiz(quiz)
  }, [quiz?.id])

  if (status !== "ready") return <QuizItemSkeleton/>

  return (
    <div className=" flex justify-between px-4 py-10">
      <div className="flex flex-col gap-1.5">
        <Heading as="h2">
          {quiz?.title}
        </Heading>
        <p>{quiz?.description}</p>

      </div>
      <div>
        <Button
          onClick={startQuiz}
          intent={"standard"}
           
        >
            
          <Link to={`questions/${currentQuiz?.questions[0].questionId}`}>
          Iniciar quiz
          </Link>
       
        </Button>
      </div>
    </div>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { quizId } = params;

  if (!quizId) return

  const quiz = await fetchQuiz(quizId);

  return quiz;
}
