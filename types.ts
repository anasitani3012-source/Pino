
export enum TaskType {
  SUMMARY = 'SUMMARY',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  PODCAST = 'PODCAST',
  VIDEO = 'VIDEO',
  AGENT = 'AGENT',
  SLIDES = 'SLIDES',
  CODE = 'CODE'
}

export interface User {
  id: string;
  email: string;
  isPro: boolean;
  name: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: TaskType;
  content: string;
  timestamp: number;
  metadata?: any;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  type?: 'text' | 'slides' | 'code';
  data?: any;
}
