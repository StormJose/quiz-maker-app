
export type QuestionType = "multiple_choice" | "true_false"

export interface RawQuestion { 
  question_id: string;
  description: string;
  order: number;
  points_rewarded: number;
  type: QuestionType;
}