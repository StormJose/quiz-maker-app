import { Switch } from "@/components/ui/switch";
import { useBuilder } from "@/contexts/BuilderContext";

export default function QuizSettings() {
  const {
    enableTimer,
    shuffle,
    customScore,
    toggleTimer,
    toggleShuffle,
    toggleCustomScore,
  } = useBuilder();

  function handleTimer() {
    toggleTimer();
  }

  function handleShuffle() {
    toggleShuffle();
  }

  function handleCustomScore() {
    toggleCustomScore();
  }

  return (
    <div className="grid gap-y-12">
      <h3 className="text-xl font-bold">Execução</h3>

      <div className="grid gap-y-12 items-center">
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch onClick={handleCustomScore} checked={customScore} />
          <div>
            <h4 className="font-bold text-md">Customizar pontuação</h4>
            <p className="text-accent-foreground">
              Ao escolher esta opção, você define a pontuação individual para
              cada questão, permitindo hierarquizá-las por dificuldade.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch onClick={handleTimer} checked={enableTimer} />
          <div>
            <h4 className="font-bold text-md">Cronômetro</h4>
            <p className="text-accent-foreground">
              Defina um tempo-alvo para a finalização do quiz
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch />
          <div>
            <h4 className="font-bold text-md">Respostas em Tempo Real</h4>
            <p className="text-accent-foreground">
              Permita que os usuários vejam o resultado imediatamente
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch onClick={handleShuffle} checked={shuffle} />
          <div>
            <h4 className="font-bold text-md">Ordem aleatória</h4>
            <p className="text-accent-foreground">
              Embaralhe as questões sempre que o quiz é iniciado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
