import { fetchQuiz } from "../../api/supabaseApi.js";
import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useQuizzes } from "../../contexts/QuizzesContext.js";
import QuizNav from "./QuizNav.js";
import Button from "../../ui/Button.js";
import QuizMenu from "./QuizMenu.js";
import AnimatedCheckbox from "@/components/ui/checkbox.js";

export default function InQuiz() {
  const navigate = useNavigate();
  const { result: quiz, questionId } = useLoaderData();
  const { dispatch, currentQuiz, selectedAnswers, totalScore } = useQuizzes();

  const questions = quiz?.questions ?? {};
  const curQuestion =
    quiz && questions.find((question) => question.id === Number(questionId));
  console.log(curQuestion);

  const selectedAnswer = selectedAnswers.find(
    (answer) => answer.questionId === curQuestion.id
  );

  const isFirst = curQuestion?.order === 1;
  const isLast = curQuestion?.order === questions.length - 1;

  console.log(questions, isLast);
  const allAnswersChecked = selectedAnswers.length === quiz?.questions.length;
  const IsTryOut = location.pathname
    .split("/")
    .filter((segment) => segment === "tryout")[0];

  useEffect(() => {
    dispatch({ type: "setCurrentQuiz", payload: quiz });
    dispatch({ type: "setCurQuestion", payload: curQuestion });
  }, [dispatch, quiz, curQuestion]);

  function handleNextQuestion() {
    const nextQuestion = questions.find(
      (question) => question?.order === curQuestion?.order + 1
    );
    if (!isLast) navigate(`/quizzes/${quiz.id}/questions/${nextQuestion.id}`);
  }

  function handlePreviousQuestion() {
    const previousQuestion = questions.find(
      (question) => question.order === curQuestion.order - 1
    );
    if (!isFirst) {
      navigate(`/quizzes/${quiz.id}/questions/${previousQuestion.id}`);
    }
  }

  function handleSelectAnswer(answer) {
    const newAnswer = {
      questionId: curQuestion.id,
      answer,
    };

    dispatch({ type: "selectAnswer", payload: newAnswer });
  }

  function handleSubmitAnswers() {
    dispatch({ type: "submitQuiz" });

    navigate(`/quiz/results`);

    console.log(totalScore);
  }

  function handleRedirectToEdit() {
    navigate(-1);
  }

  function handleBeforeUnload(e) {
    e.preventDefault();

    dispatch({});

    e.returnValue = true;
  }

  window.addEventListener("beforeunload", handleBeforeUnload);

  if (currentQuiz === null) return;

  return (
    <div className=" relative grid justify-items-center h-full bg-main-500 px-48 py-8  bg-gray-50">
      <div className="lg:max-w-1/2">
        <div className="self-end">
          {IsTryOut && (
            <Button
              onClick={handleRedirectToEdit}
              additionalStyles={"rounded-3xl bg-grey p-3"}
              tooltip={"Voltar a edição"}
              tooltipPosition={"left"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 group-hover/button:text-main">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-y-8 px-4">
          <QuizMenu />
          <QuizNav />
        </div>

        <div className="text-center mx-4">
          <h3 className="mt-12 mb-auto">{curQuestion?.description}</h3>
          <ul className=" mt-18 flex flex-col gap-3">
            {curQuestion?.answers
              .sort((a, b) => a.order - b.order)
              .map((answer) => (
                <li
                  className={` ${
                    selectedAnswer?.answer.id === answer.id
                      ? "border-primary"
                      : ""
                  } cursor-pointer flex items-center gap-2 px-4 py-5 border-[1px] bg-white rounded-2xl text-start`}
                  key={answer.id}
                  onClick={() => handleSelectAnswer(answer)}>
                  <AnimatedCheckbox
                    checked={selectedAnswer?.answer.id === answer.id}
                    className={`${
                      selectedAnswer?.answer.id === answer.id
                        ? "bg-primary"
                        : ""
                    }  transition-colors `}
                  />
                  {answer.content}
                </li>
              ))}
          </ul>
        </div>
        <footer className="flex justify-between px-4 py-8 mt-12 w-full border-t-[1.55px] border-grey bottom-0 rounded-xl">
          <Button
            styles={"alternate"}
            additionalStyles={`px-4 py-1.5 ${
              isFirst ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={handlePreviousQuestion}>
            Anterior
          </Button>

          {isLast ? (
            <Button
              styles={"standard"}
              disabled={!allAnswersChecked}
              additionalStyles={`px-4 py-1.5`}
              tooltip={
                !allAnswersChecked ? "Falta responder algumas perguntas!" : ""
              }
              onClick={handleSubmitAnswers}>
              Concluir
            </Button>
          ) : (
            <Button
              styles={"standard"}
              additionalStyles={`px-4 py-1.5 ${
                isLast ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={handleNextQuestion}>
              Próxima
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const { quizId, questionId } = params;
  const result = await fetchQuiz(quizId);

  if (!result) throw new Response("Erro ao carregar o quiz", { status: 404 });

  const questions = await result?.questions;
  if (!questions || !questionId) {
    throw new Response("Questão não encontrada", { status: 404 });
  }
  return {
    result,
    questionId,
  };
}
