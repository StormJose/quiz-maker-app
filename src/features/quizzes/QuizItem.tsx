import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useQuizzes } from "../../store/quizzesStore";
import { Ellipsis, Pen, Timer } from "lucide-react";
import { Heading } from "@/ui/Heading";
import { useState } from "react";
import { Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { useWarningDialog } from "@/hooks/useWarningDialog";
import ConfirmAction from "@/ui/dialogs/confirm-action-dialog";


interface QuizItemProps {
  quiz: Quiz
}

export default function QuizItem({ quiz }: QuizItemProps) {
  const navigate = useNavigate();
  const { handleDeleteQuiz } = useQuizzes();
  const { dispatch } = useWarningDialog()
  const [selectedCard, setSelectedCard] = useState(false);
  const numQuestions = quiz.questions.length;
  return (
    <motion.div
      layout
      className="relative flex flex-col gap-2 h-[250px] items-start text-start justify-between px-6 py-4 bg-grey rounded-md hover:bg-grey group cursor-pointer"
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
      onClick={() => navigate(`/quizzes/${quiz.quizId}`)}
      onHoverStart={() => {
        setSelectedCard((open) => !open);
      }}
      onHoverEnd={() => {
        setSelectedCard(false);
      }}>
      <div className="w-full flex items-center justify-between">
        {!quiz.published && (
          <span className="bg-amber-500 text-xs text-foreground px-4 py-1.5 rounded-2xl font-bold">
            RASCUNHO
          </span>
        )}
        <div>
          <div className="flex items-center">
            <Timer />
            <span className="text-xs">{numQuestions}min</span>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "auto" }}
        exit={{ height: 2 }}
        transition={{ ease: "easeInOut" }}>
        <Heading as={"h3"}> {quiz.title} </Heading>
      </motion.div>

      <AnimatePresence initial={false}>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 1 }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 250,
                damping: 50,
                
              },
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className="overflow-hidden">
            <p className="mt-3 text-sm text-gray-500">{quiz.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative flex items-center self-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <Button
            
            type="button"
            tooltip="Edit Quiz"
            onClick={(e) => e?.stopPropagation()}>
            <Link to={`/quiz/${quiz.quizId}/edit`}>
              <Pen width={18}/>
            </Link>
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 cursor-pointer hover:bg-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                aria-label="More options">
                <Ellipsis />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                side="top"
                align="start"
                sideOffset={6}
                className="bg-white rounded-xl border-tint shadow-xs min-w-[120px] z-50
                  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
                  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ">
                <DropdownMenu.Item
                  className="text-gra text-sm px-3 py-4  cursor-pointer
                    hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    data-[highlighted]:bg-gray-100">
                  Compartilhar
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => 
                    dispatch({
                      type: "confirmAction",
                      payload: {
                        dialogLabel: "Excluir Quiz",
                        dialogMessage: `Tem certeza de que deseja excluir ${quiz.title}?`,
                        data: quiz.quizId,                        
                        handler: handleDeleteQuiz,
                      }
                    })
                  }
                  className="text-gra text-sm px-3 py-4  cursor-pointer
                    hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    data-[highlighted]:bg-gray-100">
                  Excluir
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
  
      </div>
    </motion.div>
  );
}
