import { Question } from "./questions";

export interface Quiz {
  quizId: string;
  title: string;
  description: string;
  questions: Question[];
  enableTimer: boolean;
  shuffle: boolean;
  customScore: boolean;
  published: boolean;
}