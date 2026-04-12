
export interface Quiz {
  quizId: string;
  title: string;
  description: string;
  published: boolean;
  enableTimer: boolean;
  shuffle: boolean;
  customScore: boolean;
  realTimeAnswer: boolean;
}