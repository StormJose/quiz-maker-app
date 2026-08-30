
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionItem from "./QuestionItem";
import QuestionItemSkeleton from "./QuestionItemSkeleton";
import QuizNav from "./QuizNav";
import { fetchQuiz } from "@/api/supabaseApi";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useQuizzes } from "@/store/quizzesStore";

const TRANSITION_DURATION = 0.20;
const SKELETON_HOLD = 0.20;

export default function InQuiz() {

  const {quiz, question} = useLoaderData()
  const {setCurrentQuiz, setCurQuestion, currentQuiz, curQuestion } = useQuizzes()
  const [phase, setPhase] = useState<"question" | "skeleton">("question")

  const totalQuestions = currentQuiz?.questions ? currentQuiz.questions.length : 0;

  const currentIndex = question ? ((currentQuiz?.questions.indexOf(question))?? -1) : - 1

  const progress = ((currentIndex + 1)   / totalQuestions) * 100;

  useEffect(() => {
    setCurrentQuiz(quiz)

    if (curQuestion == null) {
      setCurQuestion(question)
      return
    }

    if (question?.questionId !== curQuestion?.questionId) {
      setPhase("skeleton")
    }
  }, [quiz.quizId, question])

  useEffect(() => {
    if (phase !== "skeleton") return

    const timeout = setTimeout(() => {
      setCurQuestion(question)
      setPhase("question")
    }, (TRANSITION_DURATION + SKELETON_HOLD) * 1000)

    return () => clearTimeout(timeout)
  }, [phase, question])

  if (currentQuiz == null) return
 
  return (
    <main className="relative min-h-screen overflow-hidden  text-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_35%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Quiz em andamento</p>
              <h1 className="text-xl font-semibold">{currentQuiz?.title}</h1>
            </div>

            {/* <Timer /> */}
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-main/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-main via-accent to-sky-400"
              initial={{ width: 0 }}  
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <p className="mt-3 text-right text-sm text-slate-400">
            {currentIndex + 1} de {totalQuestions}
          </p>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === "skeleton" ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: TRANSITION_DURATION }}
              >
                <QuestionItemSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: TRANSITION_DURATION }}
              >
                <QuestionItem />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <QuizNav />
      </section>
    </main>
  );
}

export async function loader({ params }: LoaderFunctionArgs ) {
  const { quizId, questionId } = params;

  if (!quizId) return

  const currentQuiz = await fetchQuiz(quizId)
  const question = currentQuiz?.questions.find((q) => q.questionId === questionId)
  if (!currentQuiz?.quizId) throw Error('Não foi possível carregar Quiz')
  

  return {quiz: currentQuiz, question}
}
