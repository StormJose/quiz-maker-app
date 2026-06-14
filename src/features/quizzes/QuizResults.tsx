import { Link, useNavigate } from "react-router";
import { useQuizzes } from "../../store/quizzesStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

function QuizResults() {

    const { currentQuiz, totalScore, numCorrectAnswers } = useQuizzes()

    const navigate = useNavigate()

    useEffect(() => {
        if (currentQuiz === undefined) navigate('/')
        
    }, [])

    const numQuestions = currentQuiz?.questions?.length

    return (
      <div className="mx-4 grid grid-rows-3 h-screen">
        <header className="grid gap-2 h-4">
          <h1 className="font-bold text-lg">
            <span className="text-6xl">{numCorrectAnswers}</span>/
            <span className=" mr-2 text-md">{numQuestions}</span>
            Acertos
          </h1>
          <p>Pontuação total: {totalScore}</p>
        </header>

        <div className="flex  gap-2 items-start  mt-auto">
          <Button
            intent={"standard"}
            >
              <Link to={`/quizzes/${currentQuiz?.quizId}/questions/${currentQuiz?.questions[0].questionId}`}>
              </Link>
            Reiniciar Quiz
          </Button>
          <Button
            intent={"alternate"}
            onClick={() => navigate("/")}
            >
            Sair
          </Button>
        </div>
      </div>
    );
}

export default QuizResults
