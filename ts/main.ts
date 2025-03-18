import { API_KEY } from './config';

// Global variables
const currentFlashcardIndex = 0;

// Dom Cache
const $generateBtn = document.getElementById(
  'generate-btn',
) as HTMLButtonElement;
const $saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const $inputField = document.getElementById('user-input') as HTMLInputElement;
const flashcardContainer = document.getElementById(
  'flashcard-container',
) as HTMLElement;

// Fetch
async function generateFlashcard(): Promise<void> {
  const userInput = $inputField.value;
  if (!userInput) {
    console.log('Please enter a topic!');
    return;
  }

  const prompt = `Create a flashcard with a question and answer about: ${userInput}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    console.log(' Api response:', data);
  } catch (error) {
    console.log('Error Fetching AI Response:', error);
  }
}


So if I add all this can I push?
