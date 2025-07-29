import { fetchQuiz } from "../../api/supabaseApi.js";
import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useQuizzes } from "../../contexts/QuizzesContext.js";
import QuizNav from "./QuizNav.js";
import Button from "../../ui/Button.js";
import QuizMenu from "./QuizMenu.js";

export default function InQuiz() {
  const navigate = useNavigate();
  const { dispatch, currentQuiz, selectedAnswers, totalScore } = useQuizzes();
  const { data: quiz, questionIndex } = useLoaderData();

  // const quiz = {}
  // const questionIndex = 0

  const questions = quiz?.questions ?? {};
  const curQuestion = questions[questionIndex];

  const selectedAnswer = selectedAnswers.find(
    (answer) => answer.questionId === curQuestion.id
  );

  const isFirst = questionIndex === 0;
  const isLast = questionIndex === questions.length - 1;

  const allAnswersChecked = selectedAnswers.length === quiz.questions?.length;
  const IsTryOut = location.pathname
    .split("/")
    .filter((segment) => segment === "tryout")[0];

  useEffect(() => {
    dispatch({ type: "setCurrentQuiz", payload: quiz });
    dispatch({ type: "setCurQuestion", payload: curQuestion });
  }, [quiz, curQuestion]);

  function handleNextQuestion() {
    if (!isLast) navigate(`/quizzes/${quiz.id}/questions/${questionIndex + 1}`);
  }

  function handlePreviousQuestion() {
    if (!isFirst)
      navigate(`/quizzes/${quiz.id}/questions/${questionIndex - 1}`);
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
    <div className=" relative bg-main-500 max-w-full">
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
          {curQuestion?.answers.map((answer) => (
            <li
              className={` ${
                selectedAnswer?.answer.id === answer.id ? "border-pink-600" : ""
              } cursor-pointer px-4 py-5 border-[1px] border-gray-300 rounded-xl text-start`}
              key={answer.id}
              onClick={() => handleSelectAnswer(answer)}>
              {answer.text}
            </li>
          ))}
        </ul>
      </div>
      <footer className="flex justify-between px-4 py-8 fixed w-full border-t-[1.55px] border-grey bottom-0 rounded-xl">
        <Button
          styles={"alternate"}
          additionalStyles={isFirst ? "pointer-events-none opacity-50" : ""}
          onClick={handlePreviousQuestion}>
          Anterior
        </Button>

        {isLast ? (
          <Button
            styles={"standard"}
            disabled={!allAnswersChecked}
            tooltip={
              !allAnswersChecked ? "Falta responder algumas perguntas!" : ""
            }
            onClick={handleSubmitAnswers}>
            Concluir
          </Button>
        ) : (
          <Button
            styles={"standard"}
            additionalStyles={isLast ? "pointer-events-none opacity-50" : ""}
            onClick={handleNextQuestion}>
            Próxima
          </Button>
        )}
      </footer>
    </div>
  );
}

export async function loader({ params }) {
  const { quizId, questionId } = params;

  const { data, error } = await fetchQuiz(quizId);

  if (error) throw new Response("Erro ao carregar o quiz", { status: 404 });

  console.log(data);

  const index = Number(questionId);
  const questions = data?.questions;

  if (!questions || isNaN(index) || index < 0 || index >= questions.length) {
    throw new Response("Questão não encontrada", { status: 404 });
  }

  return {
    data,
    questionIndex: index,
  };
}
