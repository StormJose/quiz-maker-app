import { RawAnswer } from "./answers";
import { QuestionType } from "./questions";

export interface RawQuestion { 
  question_id: string;
  description: string;
  order: boolean;
  points_rewarded: number;
  type: QuestionType;
  answers: RawAnswer[]
}

export interface RawFullQuizView {
  quiz_id: string;
  title: string;
  description: string;
  questions: RawQuestion[];
  published: boolean;
  enable_timer: boolean;
  shuffle: boolean;
  custom_score: boolean;
  real_time_answer: boolean;
}   