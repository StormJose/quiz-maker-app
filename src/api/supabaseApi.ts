import { getCurrentUser } from "@/auth/auth";
import supabase from "@/utils/supabase";

const baseURL = "http://localhost:8000/quizzes";

export const fetchQuizzes = async function (userId) {
  try {
    const { data, error } = await supabase
      .from("full_quiz_view")
      .select("*")
      .eq("user_id", userId);

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

export const fetchNumOfQuizzes = async function (filters = {}) {
  const { column, value } = filters;

  const { user: curUser } = await getCurrentUser();

  try {
    // Head to 'true' will return the count value only

    if (Object.entries(filters).length !== 0) {
      const { data, count, error } = await supabase
        .from("quizzes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", curUser.id)
        .eq(column, value);

      if (error) {
        console.log(error);
        throw error;
      }
      return count;
    } else {
      const { data, count, error } = await supabase
        .from("quizzes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", curUser.id);

      if (error) {
        console.log(error);
        throw error;
      }
      return count;
    }
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

    const quizData = {
      ...data,
      settings: {
        customScore: data.custom_score,
        enableTimer: data.enable_timer,
        shuffle: data.shuffle,
      },
    };
    return quizData;
  } catch (error) {
    console.error(error);
  }
};

export const insertQuiz = async function (newQuiz) {
  console.log(newQuiz);
  const { user: curUser } = await getCurrentUser();
  const { settings, questions, ...quiz } = newQuiz;

  const flattenedQuestions = questions.map(
    ({ id, description, order, type }) => {
      return { id, description, order, quiz: quiz.id, type };
    }
  );

  const answers = questions.flatMap((question) =>
    question.answers.map((answer) => ({
      question: question.id,
      ...answer,
    }))
  );

  try {
    const { data, error } = await supabase.from("quizzes").upsert({
      ...quiz,
      user_id: curUser?.id,
      custom_score: settings.customScore,
      enable_timer: settings.enableTimer,
      shuffle: settings.shuffle,
    });

    await insertQuestions(flattenedQuestions);
    await insertAnswers(answers);

    if (error) throw error;

    console.log(flattenedQuestions);
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

export const upsertQuizSettings = async function (quizData) {
  const { user: curUser } = await getCurrentUser();
  const { settings } = quizData;

  const update = {
    id: quizData.id,
    custom_score: settings.customScore,
    enable_timer: settings.enableTimer,
    shuffle: settings.shuffle,
  };

  try {
    const { data, error } = await supabase
      .from("quizzes")
      .upsert({ ...update, user_id: curUser.id }, { onConflict: "id" })
      .select("*");

    if (error) throw error;

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateQuiz = async function (quizData) {};

export const deleteQuiz = async function (quizId) {
  console.log(quizId);
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", quizId)
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// const addQuestion = async function(quizId, questionId) {
//     const res = await fetch(`http://localhost:8000/questions`);
// }

const updateQuestion = async function (questionId) {};

export const deleteQuestion = async function (questionId) {
  console.log(questionId);
  try {
    const { data: answersData } = await supabase
      .from("answers")
      .delete()
      .eq("question", questionId)
      .select();

    const { data, error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId)
      .select();

    if (error) throw error;

    return { data, answersData };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAnswer = async function (answerId) {
  try {
    console.log(answerId);
    const { data, error } = await supabase
      .from("answers")
      .delete()
      .eq("id", answerId)
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
