import { getCurrentUser } from "@/auth/auth";
import supabase from "@/utils/supabase";

const baseURL = "http://localhost:8000/quizzes";

export const fetchQuizzes = async function (userId) {
  try {
    const { data, error } = await supabase
      .from("full_quiz_view")
      .select("*")
      .eq("user", userId);

    if (error) {
      console.log(error);
      throw error;
    }
    console.log(data);
    return {
      data,
      error,
    };
  } catch (error) {
    console.error(error);
  }
};

export const fetchQuiz = async function (quizId) {
  try {
    const { data, error } = await supabase
      .from("full_quiz_view")
      .select("*")
      .eq("id", quizId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const insertQuiz = async function (newQuiz) {
  const { questions, ...quiz } = newQuiz;

  const { user: curUser } = await getCurrentUser();

  try {
    const { data, error } = await supabase
      .from("quizzes")
      .insert({ ...quiz, user_id: curUser?.id });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const insertQuestions = async function (questionData) {
  try {
    const { data, error } = await supabase
      .from("questions")
      .upsert(questionData, { onConflict: "id" })
      .select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const insertAnswers = async function (answerData) {
  try {
    const { data, error } = await supabase
      .from("answers")
      .upsert(answerData, { onConflict: "id" })
      .select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateQuiz = async function (quizData) {};

export const deleteQuiz = async function (quizId) {
  try {
    const res = await fetch(`${baseURL}/${quizId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Erro ao deletar quiz");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// const addQuestion = async function(quizId, questionId) {
//     const res = await fetch(`http://localhost:8000/questions`);
// }

const updateQuestion = async function (questionId) {};

const deleteQuestion = async function (questionId) {};
