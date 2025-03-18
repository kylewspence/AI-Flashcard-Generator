/* exported data */
type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

const flashcards: Flashcard[] = JSON.parse(
  localStorage.getItem('flashcards') || '[]',
);
