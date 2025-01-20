export type TestPart = {
  id: string;
  title: string;
  duration: number; // in seconds
  description: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  type: 'basic' | 'long-turn' | 'follow-up';
  preparationTime?: number; // in seconds, for long-turn questions
};

export type TestResult = {
  id: string;
  date: string;
  scores: {
    fluency: number;
    coherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  feedback: string;
  audioUrl?: string;
  transcript?: string;
};

export type TestSession = {
  id: string;
  currentPart: number;
  currentQuestion: number;
  isRecording: boolean;
  isPreparation: boolean;
  timeRemaining: number;
  results: TestResult[];
};