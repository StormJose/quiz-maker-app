import { redirect, useNavigate } from "react-router";
import { useQuizzes } from "../../contexts/QuizzesContext";
import Button from "../../ui/Button";
import { useEffect } from "react";

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

                <h1 className="font-bold text-lg" >
                    <span className="text-6xl">
                        {numCorrectAnswers}
                    </span>
                    /
                    <span className=" mr-2 text-md">
                        
                         {numQuestions}
                    </span>
                   Acertos
                </h1>
                <p>Pontuação total: {totalScore}</p>
            </header>
        

        <div className="flex  gap-2 items-start  mt-auto">

            <Button styles={'standard'} onClick={() => navigate(`/quizzes/${currentQuiz.id}/questions/0`)}>Reiniciar Quiz</Button>
            <Button styles={'alternate'} onClick={() => navigate('/')} >Sair</Button>
        </div>
        </div>
    )
}

export default QuizResults
