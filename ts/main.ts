// API Key Variables
const key1 = 'sk-proj-7vyDO4PFulA9RzJM_KxUIZtVTUOmdlNR7Oy8D';
const key2 = 'q1a8rQtNWWnRJ3rRtrmGJu808dnJveOjer0dVT3BlbkFJI';
const key3 = 'uqxWfNJ9rai7axHkcNhLUvJVSW1f-pksYl4jIt8Dvq9eeFM';
const key4 = 'vzFw4qYu-CcieFlcaznL-43CIA';

// DOM Cache
const $generateBtn = document.getElementById('search-btn') as HTMLButtonElement;
const $inputField = document.getElementById('user-input') as HTMLInputElement;

// Generate Listener
document.addEventListener('DOMContentLoaded', () => {
  $generateBtn?.addEventListener('click', generateFlashcard);
});

// Clicks
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains('edit-btn')) handleEdit(target);
  if (target.classList.contains('save-btn')) handleSave(target);
  if (target.classList.contains('add-btn')) handleAddToDeck(target);
});

// Edit Button

function handleEdit(target: HTMLElement): void {
  const $flashcard = target.closest('.flashcard') as HTMLElement;
  if (!$flashcard) return;

  const $questionElem = $flashcard.querySelector(
    '.flashcard-title',
  ) as HTMLElement;
  const $answerElem = $flashcard.querySelector(
    '.flashcard-content',
  ) as HTMLElement;
  const $editQuestionInput = $flashcard.querySelector(
    '.edit-question',
  ) as HTMLInputElement;
  const $editAnswerInput = $flashcard.querySelector(
    '.edit-answer',
  ) as HTMLInputElement;
  const $saveEditBtn = $flashcard.querySelector(
    '.save-btn',
  ) as HTMLButtonElement;
  const $addToDeckBtn = $flashcard.querySelector(
    '.add-btn',
  ) as HTMLButtonElement;

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
  $editQuestionInput.style.width = '100%';
  $editAnswerInput.style.width = '100%';
  $editAnswerInput.style.height = '80px';
}

// Save Button

function handleSave(target: HTMLElement): void {
  const $flashcard = target.closest('.flashcard') as HTMLElement;
  if (!$flashcard) return;

  const $questionElem = $flashcard.querySelector(
    '.flashcard-title',
  ) as HTMLElement;
  const $answerElem = $flashcard.querySelector(
    '.flashcard-content',
  ) as HTMLElement;
  const $editQuestionInput = $flashcard.querySelector(
    '.edit-question',
  ) as HTMLInputElement;
  const $editAnswerInput = $flashcard.querySelector(
    '.edit-answer',
  ) as HTMLInputElement;
  const $editBtn = $flashcard.querySelector('.edit-btn') as HTMLButtonElement;
  const $addToDeckBtn = $flashcard.querySelector(
    '.add-btn',
  ) as HTMLButtonElement;

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
}

// Add To Deck Button

function handleAddToDeck(target: HTMLElement): void {
  const $flashcard = target.closest('.flashcard') as HTMLElement;
  if (!$flashcard) throw new Error('No Flash Card');

  const $question = $flashcard.querySelector('.flashcard-title') as HTMLElement;
  const $answer = $flashcard.querySelector('.flashcard-content') as HTMLElement;

  if (!$question || !$answer)
    throw new Error('Could not find either question or answer.');

  // Retrieve existing deck or initialize
  const savedDeck = JSON.parse(localStorage.getItem('flashcards') || '[]');

  // Add new card
  savedDeck.push({ question: $question.innerText, answer: $answer.innerText });

  // Save back to localStorage
  localStorage.setItem('flashcards', JSON.stringify(savedDeck));
}

// Fetch, API, Prompt

async function generateFlashcard(): Promise<void> {
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

    flashcards.forEach((flashcard: Flashcard, index: number) => {
      const $flashcard = document.querySelector(
        `.flashcard[data-index="${index}"]`,
      ) as HTMLElement;

      if ($flashcard) {
        const $questionElem = $flashcard.querySelector(
          '.flashcard-title',
        ) as HTMLElement;
        const $answerElem = $flashcard.querySelector(
          '.flashcard-content',
        ) as HTMLElement;

        $questionElem.innerText = flashcard.question;
        $answerElem.innerText = flashcard.answer;
      }
    });
  } catch (error) {
    throw new Error(`Error Fetching AI Response: ${error}`);
  }
}
