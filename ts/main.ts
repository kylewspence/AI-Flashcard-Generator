console.log('✅ Script loaded');
console.log('✅ addFlashcard is:', typeof addFlashcard);

// API Key Variables
const key1 = 'sk-proj-7vyDO4PFulA9RzJM_KxUIZtVTUOmdlNR7Oy8D';
const key2 = 'q1a8rQtNWWnRJ3rRtrmGJu808dnJveOjer0dVT3BlbkFJI';
const key3 = 'uqxWfNJ9rai7axHkcNhLUvJVSW1f-pksYl4jIt8Dvq9eeFM';
const key4 = 'vzFw4qYu-CcieFlcaznL-43CIA';

// DOM Cache
const $generateBtn = document.getElementById('search-btn') as HTMLButtonElement;
const $inputField = document.getElementById('user-input') as HTMLInputElement;
const $inputContainer = document.querySelector('.input-container');
const $flashcardGenBox = document.querySelector('.flashcard-gen-box');
const $studyModeContainer = document.querySelector('#study-mode-container');

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

// Nav Buttons

function setActiveNavButton(activeButtonId: string): void {
  // Remove 'active' from all nav buttons
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.remove('active');
  });

  // Add 'active' to the clicked button
  document.getElementById(activeButtonId)?.classList.add('active');
}

// get name from URL
function extractPokemonNameFromImageUrl(url: string): string {
  // Split by '/' to isolate the file name, then remove the extension
  const parts = url.split('/');
  const fileName = parts[parts.length - 1]; // e.g., "pikachu.png"
  return fileName.replace('.png', '');
}

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

  const $editImageInput = $flashcard.querySelector(
    '.edit-image',
  ) as HTMLInputElement | null;

  if ($editImageInput) {
    const imageUrl = $flashcard.getAttribute('data-image') || '';
    $editImageInput.value = extractPokemonNameFromImageUrl(imageUrl);
  }

  // Toggle hidden
  $questionElem.classList.add('hidden');
  $answerElem.classList.add('hidden');
  $editQuestionInput.classList.remove('hidden');
  $editAnswerInput.classList.remove('hidden');
  $editImageInput?.classList.remove('hidden');
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

async function handleSave(target: HTMLElement): Promise<void> {
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
  const $editImageInput = $flashcard.querySelector(
    '.edit-image',
  ) as HTMLInputElement;

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
  $editImageInput.classList.add('hidden');

  const newPokemonName = $editImageInput.value.toLowerCase().trim();
  const pokeRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${newPokemonName}`,
  );
  const pokeData = await pokeRes.json();
  const newImageUrl = pokeData.sprites.front_default;
  const $imageElem = $flashcard.querySelector(
    '.pokemon-img',
  ) as HTMLImageElement;
  $imageElem.src = newImageUrl;

  saveFlashcards(savedFlashcards);
}

// Add To Deck Button

function handleAddToDeck(target: HTMLElement): void {
  const $flashcard = target.closest('.flashcard') as HTMLElement;
  if (!$flashcard) throw new Error('No Flash Card');

  const $question = $flashcard.querySelector('.flashcard-title') as HTMLElement;
  const $answer = $flashcard.querySelector('.flashcard-content') as HTMLElement;

  if (!$question || !$answer)
    throw new Error('Could not find either question or answer.');

  const $image = $flashcard.querySelector('.pokemon-img') as HTMLImageElement;

  const newFlashcard: Flashcard = {
    question: $question.innerText,
    answer: $answer.innerText,
    image: $image?.src || '',
  };

  addFlashcard(newFlashcard);
}

// Fetch, API, Prompt

async function generateFlashcard(): Promise<void> {
  const userInput = $inputField.value;

  if (!userInput) throw new Error(`No User Input`);

  const prompt = `Generate 3 unique flashcards about the topic "${userInput}".
Each flashcard should focus on a different Pokémon.

For each flashcard, return:
- a question
- an answer
- the Pokémon's name
- 5 visually distinct image URLs that help a user recognize that Pokémon (e.g. official sprites, anime stills, fan art, trading cards, etc.)


Format the output strictly as a raw JSON array like this:

[
  {
    "question": "What type is Pikachu?",
    "answer": "Pikachu is an Electric-type Pokémon.",
    "pokemon": "Pikachu",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
      "https://example.com/image4.jpg",
      "https://example.com/image5.jpg"
    ]
  },
  ...
]

Only return the JSON array. No explanations or extra text.`;

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
    console.log(
      '🖼️ Image URLs:',
      flashcards.map((f) => f.images),
    );

    for (let index = 0; index < flashcards.length; index++) {
      const flashcard = flashcards[index];
      const pokemonName = flashcard.pokemon.toLowerCase();
      const pokeRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
      );
      const pokeData = await pokeRes.json();
      const imageUrl = pokeData.sprites.front_default;
      const altImageUrl = pokeData.sprites.front_shiny;

      const images: string[] = [
        pokeData.sprites.front_default,
        pokeData.sprites.back_default,
        pokeData.sprites.front_shiny,
        pokeData.sprites.other['official-artwork'].front_default,
        pokeData.sprites.other.dream_world.front_default,
      ];

      const newFlashcard: Flashcard = {
        question: flashcard.question,
        answer: flashcard.answer,
        pokemon: flashcard.pokemon,
        images: images.filter(Boolean), // removes any null values
      };

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
        const $imageElem = $flashcard.querySelector(
          '.pokemon-img',
        ) as HTMLImageElement;
        const imageElem = $flashcard.querySelector(
          '.pokemon-img',
        ) as HTMLImageElement;
        const imageContainer = $flashcard.querySelector(
          '.image-options',
        ) as HTMLElement;

        $questionElem.innerText = flashcard.question;
        $answerElem.innerText = flashcard.answer;
        $imageElem.src = imageUrl;
        $imageElem.classList.remove('hidden');
        $flashcard.setAttribute('data-image', imageUrl);
        $flashcard.setAttribute('data-alt-image', altImageUrl);

        imageElem.classList.remove('hidden');

        imageContainer.innerHTML = ''; // Clear previous images

        flashcard.images.forEach((imgUrl: string) => {
          const img = document.createElement('img');
          img.src = imgUrl;
          img.classList.add('pokemon-option-img');
          imageContainer.appendChild(img);
        });

        for (const flashcard of flashcards) {
          const pokemonName = flashcard.pokemon.toLowerCase();

          const imagePrompt = `
   Give me 5 real working image URLs for the Pokémon "${pokemonName}". Only use URLs from trusted sources like:
- https://assets.pokemon.com
- https://archives.bulbagarden.net
- https://img.pokemondb.net

Do not return any DeviantArt, Pinterest, or wixmp URLs.
Only include images from sources like assets.pokemon.com, cdn.bulbagarden.net, or pokemonpets.com.
Do not include links from nocookie.net or any site that may not support hotlinking.
Return a plain JSON array of 5 image URLs.
    Return ONLY a JSON array like:
    [
      "https://...",
      "https://...",
      ...
    ]
  `;

          const imageResponse = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${key1}${key2}${key3}${key4}`,
              },
              body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: imagePrompt }],
                temperature: 0.7,
                max_tokens: 300,
              }),
            },
          );

          const imageData = await imageResponse.json();
          const images = JSON.parse(imageData.choices[0].message.content);

          // ⬇️ Attach it to the flashcard
          flashcard.images = images;
        }
      }
    }
  } catch (error) {
    throw new Error(`Error Fetching AI Response: ${error}`);
  }
}

// Study Mode

const $studyModeBtn = document.getElementById(
  'study-mode-btn',
) as HTMLButtonElement;
$studyModeBtn.addEventListener('click', enterStudyMode);

function enterStudyMode(): void {
  setActiveNavButton('study-mode-btn');
  $inputContainer?.classList.add('hidden');
  $flashcardGenBox?.classList.add('hidden');
  $studyModeContainer?.classList.remove('hidden');

  loadFlashcards();
  showFlashcard(0);
}

// Exit Study Mode
document.getElementById('generate-btn')?.addEventListener('click', () => {
  setActiveNavButton('generate-btn');
  $inputContainer?.classList.remove('hidden');
  $flashcardGenBox?.classList.remove('hidden');
  $studyModeContainer?.classList.add('hidden');
});

let savedFlashcards: Flashcard[] = [];

// Load from Local
function loadFlashcards(): void {
  savedFlashcards = getFlashcards();

  const $studyQuestion = document.getElementById(
    'study-question',
  ) as HTMLElement;
  const $showAnswerBtn = document.getElementById(
    'show-answer-btn',
  ) as HTMLButtonElement;
  const $nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

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

// Study Mode - Updates card from saved. Called on "Next".
function showFlashcard(index: number): void {
  const flashcard = savedFlashcards[index];

  const questionElem = document.getElementById('study-question')!;
  const answerElem = document.getElementById('study-answer')!;
  const imageElem = document.getElementById('study-image') as HTMLImageElement;

  questionElem.innerText = flashcard.question;
  answerElem.innerText = flashcard.answer;
  answerElem.classList.add('hidden');

  if (flashcard.images && flashcard.images.length > 0) {
    imageElem.src = flashcard.images[0];
    imageElem.classList.add('hidden'); // hidden until user clicks "Show Answer"
  } else {
    imageElem.src = '';
    imageElem.classList.add('hidden');
  }
}

// Study Mode - Unused?
// function displayFlashcard(index: number): void {
//   const studyCard = document.getElementById(
//     'study-mode-container',
//   ) as HTMLElement;
//   const studyQuestion = studyCard.querySelector(
//     '.flashcard-title',
//   ) as HTMLElement;
//   const studyAnswer = studyCard.querySelector(
//     '.flashcard-content',
//   ) as HTMLElement;

//   if (savedFlashcards.length === 0) {
//     studyQuestion.innerText = 'No flashcards available.';
//     studyAnswer.innerText = '';
//     return;
//   }

//   const flashcard = savedFlashcards[index];
//   studyQuestion.innerText = flashcard.question;
//   studyAnswer.classList.add('hidden');
// }

document.getElementById('show-answer-btn')?.addEventListener('click', () => {
  const $studyAnswer = document.getElementById('study-answer') as HTMLElement;
  const $studyImage = document.getElementById(
    'study-image',
  ) as HTMLImageElement;

  $studyAnswer.classList.remove('hidden');
  $studyImage.classList.remove('hidden');
});

let studyIndex = 0;

document.getElementById('next-btn')?.addEventListener('click', () => {
  if (savedFlashcards.length === 0) return;

  studyIndex = (studyIndex + 1) % savedFlashcards.length;
  showFlashcard(studyIndex);
});

// Edit Mode

document.getElementById('edit-deck-btn')?.addEventListener('click', () => {
  setActiveNavButton('edit-deck-btn');
  document.querySelector('.input-container')?.classList.add('hidden');
  document.querySelector('.flashcard-gen-box')?.classList.add('hidden');
  document.querySelector('#study-mode-container')?.classList.add('hidden');
  document.querySelector('#edit-deck-container')?.classList.remove('hidden');
});
