const inputCode = document.getElementById('inputCode');
const startButton = document.getElementById('startButton');
const highlightedText = document.getElementById('highlightedText');
const typingArea = document.getElementById('typingArea');
const results = document.getElementById('results');

let originalText = '';
let startTime;

startButton.addEventListener('click', () => {
  originalText = inputCode.value;

  if (!originalText.trim()) {
    alert('Please paste a code block to type.');
    return;
  }

  highlightedText.innerHTML = originalText
    .split('')
    .map((char) => `<span>${char === '\n' ? '\n' : char}</span>`)
    .join('');

  inputCode.disabled = true;
  typingArea.disabled = false;
  typingArea.value = '';
  results.textContent = '';
  typingArea.focus();

  startTime = new Date();
});

typingArea.addEventListener('keydown', (event) => {
  // Handle tab key for indentation
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = typingArea.selectionStart;
    const end = typingArea.selectionEnd;

    // Insert a tab character
    typingArea.value =
      typingArea.value.substring(0, start) +
      '\t' +
      typingArea.value.substring(end);

    // Move the cursor after the tab character
    typingArea.selectionStart = typingArea.selectionEnd = start + 1;
  }
});

typingArea.addEventListener('input', () => {
  const typedText = typingArea.value;
  const spans = highlightedText.querySelectorAll('span');

  for (let i = 0; i < spans.length; i++) {
    const char = originalText[i] || '';
    const typedChar = typedText[i] || '';

    if (typedChar === '') {
      spans[i].className = '';
    } else if (typedChar === char) {
      spans[i].className = 'correct';
    } else {
      spans[i].className = 'incorrect';
    }
  }

  if (typedText === originalText) {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    const accuracy = calculateAccuracy(originalText, typedText);

    results.textContent = `Completed in ${timeTaken.toFixed(
      2
    )} seconds with ${accuracy}% accuracy.`;
    typingArea.disabled = true;
    inputCode.disabled = false;
  }
});

function calculateAccuracy(original, typed) {
  let correctChars = 0;

  for (let i = 0; i < original.length; i++) {
    if (original[i] === typed[i]) {
      correctChars++;
    }
  }

  return ((correctChars / original.length) * 100).toFixed(2);
}
