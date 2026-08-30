import { getCurrentUser } from "@/auth/auth";
import {
  normalizeQuiz,
  toDbAnswer,
  toDbQuestion,
  toDbQuiz,
} from "@/lib/mappers";
import { Quiz } from "@/types/quiz";
import { RawAnswer } from "@/types/raw/answers";
import { RawFullQuizView } from "@/types/raw/full-quiz-view";
import { RawQuestion } from "@/types/raw/questions";
import supabase from "@/utils/supabase";

export const fetchQuizzes = async function (userId: string) {
  try {
    const { data, error } = await supabase
      .from("full_quiz_view")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return (data as RawFullQuizView[]).map(normalizeQuiz);
  } catch (error) {
    console.error(error);
  }
};

export const fetchNumOfQuizzes = async function (filters: {column?: string, value?: boolean} = {}) {
  const { column, value } = filters;

  const { user: curUser } = await getCurrentUser();

  try {
    // Head to 'true' will return the count value only

    if (Object.entries(filters).length !== 0) {
      const { count, error } = await supabase
        .from("quizzes")
        .select("quiz_id", { count: "exact", head: true })
        .eq("user_id", curUser?.id)
        .eq(column ?? "", value);

      if (error) {

        throw error;
      }
      return count;
    } else {
      const { count, error } = await supabase
        .from("quizzes")
        .select("quiz_id", { count: "exact", head: true })
        .eq("user_id", curUser?.id);

      if (error) {
        throw error;
      }
      return count;
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchQuiz = async function (quizId: string) {
  if (!quizId) return;

  try {
    const { data, error } = await supabase
      .from("full_quiz_view")
      .select("*")
      .eq("quiz_id", quizId)
      .single();

    if (error) {
      throw error;
    }

    return normalizeQuiz(data);
  } catch (error) {
    console.error(error);
  }
};

export const insertQuiz = async function (quiz: Quiz) {
  const { user: curUser } = await getCurrentUser();

  if (!curUser?.id) return

  const dbQuiz = toDbQuiz(quiz, curUser.id);

  const flattenedQuestions = quiz.questions.map((q) =>
    toDbQuestion(q, quiz.quizId),
  );

  const answers = quiz.questions.flatMap(
    (question) =>
      question.answers.map((a) => toDbAnswer(a, question.questionId)) ?? [],
  );

  try {
    const { data, error } = await supabase.from("quizzes").upsert(dbQuiz);
    if (error) throw error;

    await insertQuestions(flattenedQuestions);
    await insertAnswers(answers);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const insertQuestions = async function (questionData: RawQuestion[]) {
  try {
    const { data, error } = await supabase
      .from("questions")
      .upsert(questionData, { onConflict: "question_id" })
      .select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error)
  }
};

export const insertAnswers = async function (answerData: RawAnswer[]) {
  try {
    const { data, error } = await supabase
      .from("answers")
      .upsert(answerData, { onConflict: "answer_id" })
      .select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const upsertQuizSettings = async function (quizData: Quiz) {
  const { user: curUser } = await getCurrentUser();

  const update = {
    quiz_id: quizData.quizId,
    custom_score: quizData.customScore,
    enable_timer: quizData.enableTimer,
    shuffle: quizData.shuffle,
  };

  try {
    const { data, error } = await supabase
      .from("quizzes")
      .upsert({ ...update, user_id: curUser?.id }, { onConflict: "quiz_id" })
      .select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteQuiz = async function (quizId: string) {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .delete()
      .eq("quiz_id", quizId)
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

export const deleteQuestion = async function (questionId: string) {
  try {
    const { data: answersData } = await supabase
      .from("answers")
      .delete()
      .eq("question", questionId)
      .select();

    const { data, error } = await supabase
      .from("questions")
      .delete()
      .eq("question_id", questionId)
      .select();

    if (error) throw error;

    return { data, answersData };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAnswer = async function (answerId: string) {
  try {
    const { data, error } = await supabase
      .from("answers")
      .delete()
      .eq("answer_id", answerId)
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
