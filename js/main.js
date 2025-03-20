import { getFlashcards, saveFlashcards, addFlashcard } from './data.js';
// API Key Variables
const key1 = 'sk-proj-7vyDO4PFulA9RzJM_KxUIZtVTUOmdlNR7Oy8D';
const key2 = 'q1a8rQtNWWnRJ3rRtrmGJu808dnJveOjer0dVT3BlbkFJI';
const key3 = 'uqxWfNJ9rai7axHkcNhLUvJVSW1f-pksYl4jIt8Dvq9eeFM';
const key4 = 'vzFw4qYu-CcieFlcaznL-43CIA';
// DOM Cache
const $generateBtn = document.getElementById('search-btn');
const $inputField = document.getElementById('user-input');
// Generate Listener
document.addEventListener('DOMContentLoaded', () => {
  $generateBtn?.addEventListener('click', generateFlashcard);
});
// Clicks
document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('edit-btn')) handleEdit(target);
  if (target.classList.contains('save-btn')) handleSave(target);
  if (target.classList.contains('add-btn')) handleAddToDeck(target);
});
// Nav Buttons
function setActiveNavButton(activeButtonId) {
  // Remove 'active' from all nav buttons
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  // Add 'active' to the clicked button
  document.getElementById(activeButtonId)?.classList.add('active');
}
// Edit Button
function handleEdit(target) {
  const $flashcard = target.closest('.flashcard');
  if (!$flashcard) return;
  const $questionElem = $flashcard.querySelector('.flashcard-title');
  const $answerElem = $flashcard.querySelector('.flashcard-content');
  const $editQuestionInput = $flashcard.querySelector('.edit-question');
  const $editAnswerInput = $flashcard.querySelector('.edit-answer');
  const $saveEditBtn = $flashcard.querySelector('.save-btn');
  const $addToDeckBtn = $flashcard.querySelector('.add-btn');
  // Toggle hidden
  $questionElem.classList.add('hidden');
  $answerElem.classList.add('hidden');
  $editQuestionInput.classList.remove('hidden');
  $editAnswerInput.classList.remove('hidden');
  target.classList.add('hidden');
  $saveEditBtn.classList.remove('hidden');
  $addToDeckBtn.classList.add('hidden');
  // Prefill inputs
  $editQuestionInput.value = $questionElem.innerText;
  $editAnswerInput.value = $answerElem.innerText;
  // Expand Input Boxes
  $editQuestionInput.classList.add('expanded-input');
  $editAnswerInput.classList.add('expanded-input');
}
// Save Button
function handleSave(target) {
  const $flashcard = target.closest('.flashcard');
  if (!$flashcard) return;
  const $questionElem = $flashcard.querySelector('.flashcard-title');
  const $answerElem = $flashcard.querySelector('.flashcard-content');
  const $editQuestionInput = $flashcard.querySelector('.edit-question');
  const $editAnswerInput = $flashcard.querySelector('.edit-answer');
  const $editBtn = $flashcard.querySelector('.edit-btn');
  const $addToDeckBtn = $flashcard.querySelector('.add-btn');
  // Save new values
  $questionElem.innerText = $editQuestionInput.value;
  $answerElem.innerText = $editAnswerInput.value;
  // Toggle visibility back
  $questionElem.classList.remove('hidden');
  $answerElem.classList.remove('hidden');
  $editQuestionInput.classList.add('hidden');
  $editAnswerInput.classList.add('hidden');
  target.classList.add('hidden');
  $editBtn.classList.remove('hidden');
  $addToDeckBtn.classList.remove('hidden');
  saveFlashcards(savedFlashcards);
}
// Add To Deck Button
function handleAddToDeck(target) {
  const $flashcard = target.closest('.flashcard');
  if (!$flashcard) throw new Error('No Flash Card');
  const $question = $flashcard.querySelector('.flashcard-title');
  const $answer = $flashcard.querySelector('.flashcard-content');
  if (!$question || !$answer)
    throw new Error('Could not find either question or answer.');
  const newFlashcard = {
    question: $question.innerText,
    answer: $answer.innerText,
  };
  addFlashcard(newFlashcard);
}
// Fetch, API, Prompt
async function generateFlashcard() {
  const userInput = $inputField.value;
  if (!userInput) throw new Error(`No User Input`);
  const prompt = `Generate exactly 3 unique flashcards about: "${userInput}".
Each flashcard should cover a different aspect of the topic.
For instance, this will mostly be used for generating flash cards about concepts relating to coding.
Consider things like creating a card for syntax or an example of how it's used.
You're helping students learn, so responses should be useful, varied, and include code examples where relevant.
Please consider the use of flash cards and how a human would hold a paper card with a question on one side, then need to be able to memorize what's on the other side.
Make the answers more robust, but not super technical.

⚠️ IMPORTANT:
 - If the answer includes code, format it clearly with line breaks.
 - Example of correct formatting:

   Question: "How do you use forEach in JavaScript?"
   Answer:
   let numbers = [1, 2, 3, 4, 5];
   numbers.forEach(function(number) {
       console.log(number);
   });
 - DO NOT include any explanations, pretext, or extra text.
 - ONLY return a JSON array with this format - you can use your own judgment for
   the questions and answers as long as they're formatted correctly - if applicable you can add a code snippet:

 [
   {
     "question":
     "answer":
   },
   {
     "question":
     "answer":
   },
   {
     "question":
     "answer":
   }
 ]`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${key1}${key2}${key3}${key4}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });
    const data = await response.json();
    const flashcards = JSON.parse(data.choices[0].message.content);
    flashcards.forEach((flashcard, index) => {
      const $flashcard = document.querySelector(
        `.flashcard[data-index="${index}"]`,
      );
      if ($flashcard) {
        const $questionElem = $flashcard.querySelector('.flashcard-title');
        const $answerElem = $flashcard.querySelector('.flashcard-content');
        $questionElem.innerText = flashcard.question;
        $answerElem.innerText = flashcard.answer;
      }
    });
  } catch (error) {
    throw new Error(`Error Fetching AI Response: ${error}`);
  }
}
// Study Mode
const $studyModeBtn = document.getElementById('study-mode-btn');
$studyModeBtn.addEventListener('click', enterStudyMode);
function enterStudyMode() {
  setActiveNavButton('study-mode-btn');
  document.querySelector('.input-container')?.classList.add('hidden');
  document.querySelector('.flashcard-gen-box')?.classList.add('hidden');
  document.querySelector('#study-mode-container')?.classList.remove('hidden');
  loadFlashcards();
  displayFlashcard(0);
}
// Exit Study Mode
document.getElementById('generate-btn')?.addEventListener('click', () => {
  setActiveNavButton('generate-btn');
  document.querySelector('.input-container')?.classList.remove('hidden');
  document.querySelector('.flashcard-gen-box')?.classList.remove('hidden');
  document.querySelector('#study-mode-container')?.classList.add('hidden');
});
let savedFlashcards = [];
// Load from Local
function loadFlashcards() {
  savedFlashcards = getFlashcards();
  const $studyQuestion = document.getElementById('study-question');
  const $showAnswerBtn = document.getElementById('show-answer-btn');
  const $nextBtn = document.getElementById('next-btn');
  if (savedFlashcards.length === 0) {
    $studyQuestion.innerText = 'No flashcards found!';
    $showAnswerBtn.classList.add('hidden');
    $nextBtn.classList.add('hidden');
  } else {
    $showAnswerBtn.classList.remove('hidden');
    $nextBtn.classList.remove('hidden');
    showFlashcard(0);
  }
}
// show flash card
function showFlashcard(index) {
  document.getElementById('study-question').innerText =
    savedFlashcards[index].question;
  document.getElementById('study-answer').innerText =
    savedFlashcards[index].answer;
  document.getElementById('study-answer').classList.add('hidden');
}
function displayFlashcard(index) {
  const studyCard = document.getElementById('study-mode-container');
  const studyQuestion = studyCard.querySelector('.flashcard-title');
  const studyAnswer = studyCard.querySelector('.flashcard-content');
  if (savedFlashcards.length === 0) {
    studyQuestion.innerText = 'No flashcards available.';
    studyAnswer.innerText = '';
    return;
  }
  const flashcard = savedFlashcards[index];
  studyQuestion.innerText = flashcard.question;
  studyAnswer.classList.add('hidden');
}
document.getElementById('show-answer-btn')?.addEventListener('click', () => {
  const $studyAnswer = document.getElementById('study-answer');
  $studyAnswer.classList.remove('hidden');
});
let studyIndex = 0;
document.getElementById('next-btn')?.addEventListener('click', () => {
  if (savedFlashcards.length === 0) return;
  studyIndex = (studyIndex + 1) % savedFlashcards.length;
  showFlashcard(studyIndex);
});
// Edit Deck
document.getElementById('edit-deck-btn')?.addEventListener('click', () => {
  setActiveNavButton('edit-deck-btn');
  document.querySelector('.input-container')?.classList.add('hidden');
  document.querySelector('.flashcard-gen-box')?.classList.add('hidden');
  document.querySelector('#study-mode-container')?.classList.add('hidden');
  document.querySelector('#edit-deck-container')?.classList.remove('hidden');
});
