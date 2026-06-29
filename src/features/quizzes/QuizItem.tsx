import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useQuizzes } from "../../store/quizzesStore";
import { Ellipsis, Pen, Share, Timer, Trash } from "lucide-react";
import { Heading } from "@/ui/Heading";
import { ReactElement, useState } from "react";
import { Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { useWarningDialog } from "@/hooks/useWarningDialog";

interface QuizItemProps {
  quiz: Quiz;
}

const ringVariants = {
  idle: { scale: 1, opacity: 0 },
  pulse: { scale: [1, 1.04, 1.08], opacity: [0.55, 0.2, 0] },
};

const ringTransition = { duration: 1.2, repeat: Infinity, ease: "easeOut" } as const;

type MenuOption = {
  id: number;
  label: string;
 icon: ReactElement;
 action: (arg: string) => Promise<void> | void
}


export default function QuizItem({ quiz }: QuizItemProps) {
  const navigate = useNavigate();
  const { handleDeleteQuiz } = useQuizzes();
  const { dispatch } = useWarningDialog();
  const [hovered, setHovered] = useState(false);
  const numQuestions = quiz.questions.length;
  
  const menuOptions: MenuOption[] = [
    {
      id: 1,
      label: "Compartilhar",
      icon: <Share className="w-4 h-4" />,
      action: () => {}
    },
    {
      id: 2,
      label: "Excluir",
      icon: <Trash className="w-4 h-4" />,
      action: (id) => dispatch({type: "confirmAction", payload: {dialogLabel: "Excluir Quiz", dialogMessage: "Tem certeza de que deseja excluir Quiz?", handler: () => handleDeleteQuiz(id), data: id }})   
    }
  ];
  return (
    <motion.div
    layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 380, damping: 28 } }}
      className="relative flex flex-col min-h-62.5 items-start text-start justify-between px-6 py-4 border-gray-200 bg-grey rounded-md cursor-pointer group border "
      onClick={() => navigate(`/quizzes/${quiz.quizId}`)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >

      <motion.div
        variants={ringVariants}
        animate={hovered ? "pulse" : "idle"}
        transition={hovered ? ringTransition : { duration: 0.15 }}
        className="absolute inset-0 rounded-md border border-[#615FFF] pointer-events-none"
      />
      <motion.div
        variants={ringVariants}
        animate={hovered ? "pulse" : "idle"}
        transition={hovered ? { ...ringTransition, delay: 0.6 } : { duration: 0.15 }}
        className="absolute inset-0 rounded-md border border-[#615FFF] pointer-events-none"
      />

      <div className="w-full flex items-center justify-between">
        {!quiz.published ? (
          <span className="bg-amber-500 text-dark text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
            RASCUNHO
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1 text-gray-400">
          <Timer size={14} />
          <span className="text-xs">{numQuestions}min</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Heading as="h3">{quiz.title}</Heading>
        <p className="text-sm text-gray-500 line-clamp-2">{quiz.description}</p>
      </div>

      <div className="flex items-center self-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        
        <Button
          type="button"
          tooltip="Edit Quiz"
          to={`/quiz/${quiz.quizId}/edit`}
          onClick={(e) => e?.stopPropagation()}
        >
            <Pen width={18} />
        </Button>
      

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 cursor-pointer hover:bg-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              aria-label="More options"
            >
              <Ellipsis />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="top"
              align="start"
              sideOffset={6}
              className="bg-white p-2 rounded-xl border-[1.55px] border-tint shadow-xs min-w-30 z-50
                data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
                data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              {menuOptions.map(({label, icon, action}, index) => (
                <>
                  {label === 'Excluir' &&  <div className="h-[1px] w-full bg-gray-300 my-2"></div>}
                <DropdownMenu.Item
                  key={index}
                  onClick={(e) => {
                    if (label === 'Excluir') {
             
                      action(quiz.quizId)
                    }
                    e?.stopPropagation()
                  }}
                  className={` rounded-xl text-sm px-3 py-4 cursor-pointer
                    flex items-center gap-2
                    hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    data-[highlighted]:bg-gray-100 ${label === 'Excluir' ? 'text-destructive ' : 'text-gray-700'} `}
                    >{icon} {label}</DropdownMenu.Item>
                    </>
              ))}
           
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </motion.div>
  );
}
