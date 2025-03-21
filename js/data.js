// Load flashcards from Local Storage
export function getFlashcards() {
  return JSON.parse(localStorage.getItem('flashcards') || '[]');
}
// Save flashcards to Local Storage
export function saveFlashcards(flashcards) {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}
// Add a flashcard to Local Storage
export function addFlashcard(newFlashcard) {
  const flashcards = getFlashcards();
  flashcards.push(newFlashcard);
  saveFlashcards(flashcards);
}
