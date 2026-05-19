export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl: string;
  joinedDate: string;
  isPublic: boolean;
  tags: string[];
  socialLinks: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface ProfileStats {
  totalQuizzes: number;
  totalShared: number;
  totalLikes: number;
  totalContributions: number;
  averageRating: number;
  totalPlays: number;
}

export interface QuizSummary {
  quizId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  questionsCount: number;
  playsCount: number;
  likesCount: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContributionSummary {
  id: string;
  type: 'comment' | 'suggestion' | 'report' | 'translation';
  quizId: string;
  quizTitle: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ProfileVisibility {
  showStats: boolean;
  showQuizzes: boolean;
  showContributions: boolean;
  showActivity: boolean;
  allowMessages: boolean;
}