// Get DOM elements
const display = document.getElementById("display");
const resultValue = document.getElementById("result-value");
const startStopBtn = document.getElementById("start-stop-btn");

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false; // Process final results only

// Variables
let isListening = false;
let total = 0;

// Event Listener: Start/Stop Listening
startStopBtn.addEventListener("click", () => {
  if (isListening) {
    recognition.stop(); // Stop listening
    startStopBtn.textContent = "Start Listening";
    isListening = false;
  } else {
    recognition.start(); // Start listening
    startStopBtn.textContent = "Stop Listening";
    isListening = true;
  }
});

// On Speech Start
recognition.onstart = () => {
  display.textContent = "Listening...";
};

// On Speech Result
recognition.onresult = (event) => {
  const speechResult = event.results[0][0].transcript.toUpperCase();
  display.textContent = speechResult;

  if (speechResult.startsWith("ADD")) {
    // Parse numbers from the command
    const numbers = speechResult
      .replace(/ADD/g, "") // Remove "ADD"
      .replace(/AND/g, "") // Remove "AND"
      .replace(/DONE/g, "") // Remove "DONE"
      .trim()
      .split(/\s+/) // Split by spaces
      .filter((word) => !isNaN(word)) // Keep only numbers
      .map(Number); // Convert to numbers

    // Calculate the total
    total = numbers.reduce((acc, num) => acc + num, 0);
    resultValue.textContent = total;

  } else if (speechResult.endsWith("DONE")) {
    recognition.stop(); // Stop when "DONE" is spoken
    startStopBtn.textContent = "Start Listening";
    isListening = false;
  } else {
    display.textContent = "Invalid command. Start with ADD and end with DONE.";
  }
};

// On Recognition Error
recognition.onerror = (event) => {
  display.textContent = `Error: ${event.error}`;
  isListening = false;
  startStopBtn.textContent = "Start Listening";
};

// On Speech End
recognition.onend = () => {
  if (isListening) {
    // Restart recognition if the user hasn't manually stopped
    setTimeout(() => recognition.start(), 500);
  }
};

recognition.onerror = (event) => {
    console.error(`Speech Recognition Error: ${event.error}`);
    display.textContent = `Error: ${event.error}. Please check your internet and microphone.`;
    isListening = false;
    startStopBtn.textContent = "Start Listening";
  };
  
  recognition.onend = () => {
    console.log("Speech recognition ended.");
    if (isListening) {
      setTimeout(() => recognition.start(), 500); // Restart after a delay
    }
  };
  if (annyang) {
    const commands = {
      '*speech': (speech) => {
        display.textContent = speech;
        if (speech.toUpperCase().startsWith("ADD")) {
          const numbers = speech
            .replace(/ADD/g, "")
            .replace(/AND/g, "")
            .replace(/DONE/g, "")
            .trim()
            .split(/\s+/)
            .filter((word) => !isNaN(word))
            .map(Number);
  
          const total = numbers.reduce((acc, num) => acc + num, 0);
          resultValue.textContent = total;
        } else if (speech.toUpperCase().endsWith("DONE")) {
          annyang.abort();
          display.textContent = "Stopped listening.";
        } else {
          display.textContent = "Invalid command. Start with ADD and end with DONE.";
        }
      },
    };
  
    annyang.addCommands(commands);
    annyang.start();
  } else {
    display.textContent = "Speech Recognition is not supported.";
  }
  