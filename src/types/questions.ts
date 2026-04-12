type QuestionType = "multiple_choice" | "true_false"

export interface Question { 
  questionId: string;
  description: string;
  order: boolean;
  pointsRewarded: number;
  type: QuestionType;
}