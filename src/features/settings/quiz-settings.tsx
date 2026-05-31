import { Switch } from "@/components/ui/switch";
import { useBuilder } from "@/store/builderStore";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges.tsx";
import { feedback } from "@/utils/toast-utils.ts";
import MultiStageButton from "@/ui/multi-stage-button.tsx";
import { Toaster } from "react-hot-toast";


export default function QuizSettings() {
  const {
    isLoading,
    status,
    currentQuiz,
    toggleTimer,
    toggleShuffle,
    toggleCustomScore,
    handleUpsertQuizSettings,
  } = useBuilder();

  const { dirty, Dialog, handleUpdateSettings } = useUnsavedChanges(currentQuiz, status);

  function handleTimer() {
    toggleTimer();
  }

  function handleShuffle() {
    toggleShuffle();
  }

  function  handleCustomScore() {
    toggleCustomScore();
  }

  async function handleSaveChanges() {
    try {
      await handleUpsertQuizSettings(currentQuiz);

      handleUpdateSettings({
        enableTimer: currentQuiz.enableTimer, 
        shuffle: currentQuiz.shuffle, 
        customScore: currentQuiz.customScore 
      });
      feedback.success("Mudanças salvas", "");
    } catch (error) {
      feedback.error("Erro ao alterar definições");
    }
  }
  console.log("currentQuiz: ", currentQuiz)


  return (
    <div className="grid gap-y-12">
      {Dialog}
      <h3 className="text-xl font-bold">Execução</h3>

      <div className="grid gap-y-12 items-center">
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch
            disabled={isLoading}
            onClick={handleCustomScore}
            checked={currentQuiz?.customScore}
          />
          <div>
            <h4 className="font-bold text-md">Customizar pontuação</h4>
            <p className="text-accent-foreground">
              Ao escolher esta opção, você define a pontuação individual para
              cada questão, permitindo hierarquizá-las por dificuldade.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch
            disabled={isLoading}
            onClick={handleTimer}
            checked={currentQuiz?.enableTimer}
          />
          <div>
            <h4 className="font-bold text-md">Cronômetro</h4>
            <p className="text-accent-foreground">
              Defina um tempo-alvo para a finalização do quiz
            </p>
          </div>
        </div>
     
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch
            disabled={isLoading}
            onClick={handleShuffle}
            checked={currentQuiz?.shuffle}
          />
          <div>
            <h4 className="font-bold text-md">Ordem aleatória</h4>
            <p className="text-accent-foreground">
              Embaralhe as questões sempre que o quiz é iniciado.
            </p>
          </div>
        </div>

        <MultiStageButton    
          disabled={!dirty}
          className="justify-self-start px-2 py-1.5"
          onClick={handleSaveChanges}
          stage={
          
            isLoading ? "loading" : dirty ? "dirty" : "idle"
          }></MultiStageButton>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
