import { useEffect } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";
import { useQuizzes } from "../../store/quizzesStore";
import { motion } from "framer-motion";
import QuizItem from "./QuizItem";
import Button from "../../ui/Button";
import { Plus } from "lucide-react";
import { Heading } from "@/ui/Heading";
import { fetchQuizzes } from "@/api/supabaseApi";
import { getCurrentUser } from "@/auth/auth";

export default function AllQuizzes() {
  const navigate = useNavigate();

  const quizzes = useLoaderData();

  const { setQuizzes } = useQuizzes();

  useEffect(() => {
    setQuizzes(quizzes);
  }, [quizzes]);

  return (
    <div className={`flex flex-col px-2 mx-8`}>
      <div className="mb-8">
        <Heading>Quizzes</Heading>
      </div>

      <header className="py-3 flex justify-end sticky top-4 z-40 bg-white rounded-md">
        {quizzes.length > 0 && (
          <Button to="/quiz/new" styles={"standard"} additionalStyles={"p-2"}>
            <Plus />
          </Button>
        )}
      </header>
      {quizzes.length === 0 && (
        <div className="flex flex-col gap-5 items-start">
          <h3>Nenhum quiz disponível. Que tal criar o seu próprio?</h3>
          <Button
            styles={"standard"}
            onClick={() => navigate("/quiz/new")}
            additionalStyles={"px-4 py-1.5"}>
            Criar quiz
          </Button>
        </div>
      )}

      <div className="grid md:grid-flow-col sm:grid-cols-2  md:grid-cols-3 sm:gap-x-3 gap-y-4 gap-x-3">
        {quizzes?.map((quiz) => (
          <motion.div
            key={quiz.quizId}
            layoutId={`item-${quiz.quizId}`}
            className="grid grid-flow-col  border-[1.55px] border-grey-tint bg-gray rounded-2xl">
            <QuizItem key={quiz.quizId} quiz={quiz} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/notFound");
  }

  const quizzes = (await fetchQuizzes(session?.user.id)) ?? [];

  return quizzes;
}
