
import { useQuizzes } from "@/store/quizzesStore";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// const answers = [
//   { id: "a", text: "Component styling", status: "default" },
//   { id: "b", text: "Navigation and routing", status: "selected" },
//   { id: "c", text: "Database migrations", status: "default" },
//   { id: "d", text: "Package bundling", status: "default" },
// ];

export default function QuestionItem() {

  const { curQuestion, selectAnswer, selectedAnswers } = useQuizzes() 
  const realTimeAnswerEnabled = useQuizzes(state => (state.currentQuiz?.realTimeAnswer));
  const questionType = curQuestion?.type === "multiple_choice" ? "Múltipla Escolha" : "Verdadeiro Ou Falso";
  const answers = curQuestion?.answers
  const selectedAnswer = selectedAnswers.find((a) => a.questionId === curQuestion?.questionId ) 

  return (
    <article className="sm:min-w-90 md:w-140 text-center rounded-3xl border border-white/10 bg-white/[0.06]  shadow-indigo-950/40 backdrop-blur-xl">
      <span className="mb-5 inline-flex rounded-full border border-main/20 bg-main/10 px-3 py-1 text-xs font-medium text-main">
        {questionType}
      </span>

      <h4 className="mb-8 text-lg font-semibold leading-snug">
        {curQuestion?.description}
      </h4>

      <div className="grid gap-4 ">
        {answers?.map((answer, index) => {

          const correctAnswer = realTimeAnswerEnabled && selectedAnswer?.questionId === curQuestion?.questionId && answer.correctAnswer
          return (
          <motion.button
          disabled={selectedAnswer?.questionId === curQuestion?.questionId}
            key={answer.answerId}
            onClick={() => selectAnswer({questionId: curQuestion?.questionId ?? '', answer:{ answerId: answer.answerId, correctAnswer: answer.correctAnswer}})}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className={`group flex items-center justify-between rounded-2xl border bg-gray p-5 text-left 
              border-white/10  text-dark transition 
              ${selectedAnswer}
              ${correctAnswer && 'bg-green-400' }
              hover:border-main/40 cursor-pointer
              `}
          >
            <div className="flex items-center gap-4">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-gray-200 text-sm text-dark">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="font-medium">
                {answer.content}
              </span>
            </div>
            
            {realTimeAnswerEnabled && selectedAnswer && !answer.correctAnswer && (
              <X className="size-5 text-rose-300" />
            )}
          </motion.button>
)})}
      </div>
    </article>
  );
}