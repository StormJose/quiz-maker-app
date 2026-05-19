import { useEffect } from "react";
import { useParams } from "react-router";
import { Switch } from "@/components/ui/switch";
import { useBuilder } from "@/store/builderStore";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges.tsx";
import Button from "@/ui/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function QuizSettings() {
  const { quizId } = useParams();

  const {
    isLoading,
    currentQuiz,
    toggleTimer,
    toggleShuffle,
    toggleCustomScore,
    toggleRealTimeAnswer,
    handleGetQuiz,
    handleUpsertQuizSettings,
  } = useBuilder();

  const { dirty, Dialog, handleUpdateSettings } = useUnsavedChanges();

  function handleTimer() {
    toggleTimer();
  }

  function handleShuffle() {
    toggleShuffle();
  }

  function handleCustomScore() {
    toggleCustomScore();
  }

  function handleRealTimeAnswer() {
    toggleRealTimeAnswer();
  }

  async function handleSaveChanges() {
    try {
      await handleUpsertQuizSettings(currentQuiz);

      handleUpdateSettings(currentQuiz);
      feedback.success("Mudanças salvas");
    } catch (error) {
      feedback.error("Erro ao alterar definições");
    }
  }

  useEffect(() => {
    async function loadQuizData() {
      try {
        await handleGetQuiz(quizId);
      } catch (error) {
        console.error(error);
      }
    }

    loadQuizData();
  }, []);

  return (
    <div className="grid gap-y-12">
      {Dialog}
      <h3 className="text-xl font-bold">Execução</h3>

      <div className="grid gap-y-12 items-center">
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch
            disabled={isLoading}
            onClick={handleCustomScore}
            checked={currentQuiz?.settings?.customScore}
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
            checked={currentQuiz?.settings?.enableTimer}
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
            onClick={handleRealTimeAnswer}
            checked={currentQuiz?.settings?.realTimeAnswer}
          />
          <div>
            <h4 className="font-bold text-md">Respostas em Tempo Real</h4>
            <p className="text-accent-foreground">
              Permita que os usuários vejam o resultado imediatamente
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[0.2fr_2fr] items-center">
          <Switch
            disabled={isLoading}
            onClick={handleShuffle}
            checked={currentQuiz?.settings?.shuffle}
          />
          <div>
            <h4 className="font-bold text-md">Ordem aleatória</h4>
            <p className="text-accent-foreground">
              Embaralhe as questões sempre que o quiz é iniciado.
            </p>
          </div>
        </div>

        {/* <Button
          disabled={!dirty}
          styles={"standard"}
          additionalStyles={"justify-self-start px-2 py-1.5"}
          onClick={handleSaveChanges}>
          Salvar definições
        </Button> */}

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
