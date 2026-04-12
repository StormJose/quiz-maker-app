
export type QuestionType = "multiple_choice" | "true_false"

export interface RawQuestion { 
  question_id: string;
  description: string;
  order: boolean;
  points_rewarded: number;
  type: QuestionType;
}