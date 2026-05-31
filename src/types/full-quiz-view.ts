import { Answer } from "./answers";
import { QuestionType } from "./raw/questions";

export interface Question { 
  questionId: string;
  description: string;
  order: number;
  pointsRewarded: number;
  type: QuestionType;
  answers: Answer[]
}

export interface FullQuizView {
  quizId: string;
  title: string;
  description: string;
  questions: Question[];
  published: boolean;
  enableTimer: boolean;
  shuffle: boolean;
  customScore: boolean;
  realTimeAnswer: boolean;
}

