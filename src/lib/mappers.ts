import { Answer } from "@/types/answers";
import { Question } from "@/types/questions";
import { FullQuizView } from "@/types/full-quiz-view";
import { RawFullQuizView } from "@/types/raw/full-quiz-view";
import { Quiz } from "@/types/quiz";

export function normalizeQuiz(raw: RawFullQuizView): FullQuizView {
  return {
    quizId: raw.quiz_id,
    title: raw.title,
    description: raw.description,
    published: raw.published,
    shuffle: raw.shuffle,
    enableTimer: raw.enable_timer,
    realTimeAnswer: raw.real_time_answer,
    customScore: raw.custom_score,
    questions: raw.questions.map((question) => ({
      questionId: question.question_id,
      description: question.description,
      order: question.order,
      type: question.type,
      pointsRewarded: question.points_rewarded,
      answers: (question.answers ?? []).map((answer) => ({
        answerId: answer.answer_id,
        content: answer.content,
        correctAnswer: answer.correct_answer,
        order: answer.order,
      })),
    })),
  };
}


// To DB Mappers

// lib/mappers.ts

export const toDbAnswer = (answer: Answer, questionId: string) => ({
  answer_id: answer.answerId,
  question: questionId,
  content: answer.content,
  correct_answer: answer.correctAnswer,
  order: answer.order,
});

export const toDbQuestion = (question: Question, quizId: string) => ({
  question_id: question.questionId,
  quiz: quizId,
  description: question.description,
  order: question.order,
  type: question.type,
  points_rewarded: question.pointsRewarded,
});

export const toDbQuiz = (quiz: Quiz, userId: string) => ({
  quiz_id: quiz.quizId,
  user_id: userId,
  title: quiz.title,
});