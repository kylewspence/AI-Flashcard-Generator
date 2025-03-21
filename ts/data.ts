// Flashcard Type Definition
export type Flashcard = {
  question: string;
  answer: string;
};

// Load flashcards from Local Storage
export function getFlashcards(): Flashcard[] {
  return JSON.parse(localStorage.getItem('flashcards') || '[]');
}

// Save flashcards to Local Storage
export function saveFlashcards(flashcards: Flashcard[]): void {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Add a flashcard to Local Storage
export function addFlashcard(newFlashcard: Flashcard): void {
  const flashcards = getFlashcards();
  flashcards.push(newFlashcard);
  saveFlashcards(flashcards);
}
