import { Answer } from "./answers";

type QuestionType = "multiple_choice" | "true_false"

export interface Question { 
  questionId: string;
  description: string;
  order: number;
  pointsRewarded: number;
  type: QuestionType;
  answers: Answer[]
}