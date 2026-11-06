// Ek jagah saare screens ke params + result ka shape.
export type ReviewItem = {
  id: number;
  question: string;
  options: string[];
  chosen: number | null;
  correctIndex: number;
  solution: string | null;
  isCorrect: boolean;
};

export type SubmitResult = {
  attemptId: number;
  score: number;
  correctCount: number;
  total: number;
  rank: number | null;
  review: ReviewItem[];
};

export type RootStackParamList = {
  Login: undefined;
  Otp: { phone: string; demoOtp?: string };
  Home: undefined;
  SubjectTests: { subject: string; label: string };
  Test: { testId: number; title: string };
  Result: { result: SubmitResult };
};
