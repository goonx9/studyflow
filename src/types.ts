export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface StudyContent {
  subject: string;
  summary: string;
  keyTopics: {
    title: string;
    content: string;
  }[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface FileData {
  name: string;
  content: string;
  type: string;
}
