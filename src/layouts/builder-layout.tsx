
import { Outlet } from "react-router"
import Sidebar from "./sidebar"
import { useBuilder } from "@/contexts/BuilderContext"
import Loader from "@/ui/Loader"


export default function BuilderLayout() {

    const { isLoading,  currentQuiz } = useBuilder()


    const numQuestions = currentQuiz?.questions.length 
    const totalPoints = numQuestions * 15
    const estimatedTime = numQuestions 
  return (
    <div
      className="border-[1.55px] border-secondary shadow-2xl shadow-secondary px-6 py-8 rounded-2xl self-center
        grid grid-cols-[1fr_2fr] w-full
    ">
      <div className=" mb-4 border-r-[1.55px] pr-4 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-2xl mb-2">Quiz Builder</h2>
          <p className="text-sidebar-accent-foreground">
            Desenvolva seu quiz com nossa poderosa ferramenta de criação e
            edição
          </p>
        </div>
        <Sidebar />

        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col space-y-3 mt-4">
            <p>
              N° de questões: <b> {numQuestions}</b>
            </p>
            <p>
              Pontuação máxima: <b> {totalPoints}</b> 
            </p>
            <p>
             Tempo estimado: <b> {estimatedTime}</b>
            </p>
          </div>
        )}
      </div>
      <div className="md:max-w-[505px] lg:max-w-[800px] pl-4">
        <Outlet />
      </div>
    </div>
  );
}
