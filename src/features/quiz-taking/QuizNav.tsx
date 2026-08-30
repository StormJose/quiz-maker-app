
import { Button } from "@/components/ui/button";
import { useQuizzes } from "@/store/quizzesStore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";



export default function QuizNav() {
  
  const navigate = useNavigate();
  const { currentQuiz, curQuestion, setCurQuestion, selectedAnswers, submitQuiz } = useQuizzes()
  const currentIndex = curQuestion ? (currentQuiz?.questions.indexOf(curQuestion) ?? -1) : - 1

  const maxQuestion = currentQuiz ? currentQuiz.questions.length - 1 : -1
  const previousQuestion = (currentQuiz?.questions[currentIndex - 1] ?? null);

  const nextQuestion = (currentQuiz?.questions[currentIndex + 1] ?? null);

  const finishQuiz = currentIndex === maxQuestion 

  function handleSubmitQuiz() {
    if (selectedAnswers.length === currentQuiz?.questions.length) {
       submitQuiz()
       navigate(`/quiz/${currentQuiz?.quizId}/end`)
    }
  }

  if (curQuestion === null) return 

  return (
    <footer className="mt-10 flex items-center justify-between px-10">
      {currentIndex != 0 &&
    <Button intent={"alternate"} onClick={() => {
      navigate(`/quizzes/${currentQuiz?.quizId}/questions/${previousQuestion?.questionId}`)
      
    }} disabled={currentIndex === 0}>

       <ArrowLeft width={20} height={20} onClick={() => {setCurQuestion(previousQuestion)}} />
      Anterior
   
    </Button>
      }

      {
        finishQuiz ?
       <Button intent={"standard"} className="ml-auto"  onClick={() => {

         handleSubmitQuiz()
        }
       } 
      >
      
          Finalizar
        <ArrowRight width={20} height={20}/>

      </Button>
      :
       <Button intent={"standard"} className="ml-auto" onClick={() => {
        navigate(`/quizzes/${currentQuiz?.quizId}/questions/${nextQuestion?.questionId}`)
       }} >
      
          Próximo
        <ArrowRight width={20} height={20}/>

      </Button>

        }
    </footer>
  );
}