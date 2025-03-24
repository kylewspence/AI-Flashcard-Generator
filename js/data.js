'use strict';
// Load flashcards from Local Storage
function getFlashcards() {
  return JSON.parse(localStorage.getItem('flashcards') || '[]');
}
// Save flashcards to Local Storage
function saveFlashcards(flashcards) {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}
// Add a flashcard to Local Storage
function addFlashcard(newFlashcard) {
  const flashcards = getFlashcards();
  flashcards.push(newFlashcard);
  saveFlashcards(flashcards);
}
