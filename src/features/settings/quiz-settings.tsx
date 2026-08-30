import { Switch } from "@/components/ui/switch";
import { useBuilder } from "@/store/builderStore";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges.tsx";
import { feedback } from "@/utils/toast-utils.ts";
import MultiStageButton from "@/ui/multi-stage-button.tsx";
import { Toaster } from "react-hot-toast";


interface SettingsList {
  id: number;
  handler: () => void;
  setting: boolean;
  title: string;
  description: string;
}



function QuizSettings() {
  const {
    isLoading,
    status,
    currentQuiz,
    toggleTimer,
    toggleShuffle,
    toggleCustomScore,
    toggleRealTimeAnswer,
    handleUpsertQuizSettings,
  } = useBuilder();

  const settings = {
    shuffle: currentQuiz.shuffle,
    customScore: currentQuiz.customScore,
    enableTimer: currentQuiz.enableTimer,
    realTimeAnswer: currentQuiz.realTimeAnswer
  };

  
  const { dirty, Dialog, handleUpdateSettings } = useUnsavedChanges(settings, status);

  function handleTimer() {
    toggleTimer();
  }

  function handleShuffle() {
    toggleShuffle();
  }

  function  handleCustomScore() {
    toggleCustomScore();
  }

  function handleRealTimeAnswer() {
    toggleRealTimeAnswer();
  }

  const settingsList: SettingsList[] = [
    {
      id: 1,
      handler: handleTimer,
      setting: currentQuiz.enableTimer,
      title: 'Cronômetro',
      description: 'Defina um tempo-alvo para a finalização do quiz.'
    },
    {
      id: 2,
      handler: handleCustomScore,
      setting: currentQuiz.customScore,
      title: 'Customizar pontuação',
      description: ' Ao escolher esta opção, você define a pontuação individual para cada questão, permitindo hierarquizá-las por dificuldade.'
    },
    {
      id: 3,
      handler: handleShuffle,
      setting: currentQuiz.shuffle,
      title: 'Ordem aleatória',
      description: 'Embaralhe as questões sempre que o quiz é iniciado.'
    },
    {
      id: 4,
      handler: handleRealTimeAnswer,
      setting: currentQuiz.realTimeAnswer,
      title: 'Resposta imediata',
      description: 'Decida se a resposta será mostrada imediatamente após a escolha ou apenas ao final do Quiz'
    },
  ]

  async function handleSaveChanges() {
    try {
      await handleUpsertQuizSettings(currentQuiz);

      handleUpdateSettings({
        shuffle: currentQuiz.shuffle, 
        customScore: currentQuiz.customScore ,
        enableTimer: currentQuiz.enableTimer,
        realTimeAnswer: currentQuiz.realTimeAnswer
      });
      feedback.success("Mudanças salvas");
    } catch (error) {
      feedback.error("Erro ao alterar definições");
    }
  }

  return (
    <div className="grid gap-y-12">
      {Dialog}
      <h3 className="text-xl font-bold">Configurações</h3>

      <div className="grid gap-y-12 items-center">

        {settingsList.map((setting) => (
          <div className="grid grid-cols-[0.2fr_2fr] items-center">
            <Switch
              disabled={isLoading}
              onClick={setting.handler}
              checked={setting.setting}
            />
            <div>
              <h4 className="font-bold text-md">{setting.title}</h4>
              <p className="text-accent-foreground">
                {setting.description}
              </p>
            </div>
        </div>
        ))}

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


export {QuizSettings as Component}