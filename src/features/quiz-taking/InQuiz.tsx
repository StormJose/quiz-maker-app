
import { motion, AnimatePresence } from "framer-motion";
import QuestionItem from "./QuestionItem";
import Timer from "./Timer";
import QuizNav from "./QuizNav";

export default function InQuiz() {
  const currentIndex = 0;
  const totalQuestions = 10;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <main className="relative min-h-screen overflow-hidden  text-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_35%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Quiz em andamento</p>
              <h1 className="text-xl font-semibold">React Fundamentals</h1>
            </div>

            <Timer quizTime={125} />
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
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
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <QuestionItem />
            </motion.div>
          </AnimatePresence>
        </div>

        <QuizNav />
      </section>
    </main>
  );
}

export async function loader({ params }) {
  const { quizId, questionId } = params;
  
  console.log(quizId, questionId)
 
}
