// Flashcard Type Definition
type Flashcard = {
  question: string;
  answer: string;
  pokemon: string;
  images: string[]; // Up to 5 image URLs
  selectedImage?: string; // optional, could default to images[0]
};

// Load flashcards from Local Storage
function getFlashcards(): Flashcard[] {
  return JSON.parse(localStorage.getItem('flashcards') || '[]');
}

// Save flashcards to Local Storage
function saveFlashcards(flashcards: Flashcard[]): void {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Add a flashcard to Local Storage
function addFlashcard(newFlashcard: Flashcard): void {
  const flashcards = getFlashcards();
  flashcards.push(newFlashcard);
  saveFlashcards(flashcards);
}
