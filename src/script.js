// Accessing DOM elements
const talkButton = document.querySelector('.talk');
const content = document.querySelector('.content');

// Initialize SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Voice output (Speech Synthesis)
function speak(message) {
    const speech = new SpeechSynthesisUtterance(message);
    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find(voice => voice.name.includes('Google')) || voices[0];
    speech.rate = 1;
    speech.pitch = 2;
    window.speechSynthesis.speak(speech);
}

// Typewriter effect
function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        content.textContent = text.substring(0, i + 1);
        i++;
        setTimeout(() => typeWriter(text, i, fnCallback), 80);
    } else if (typeof fnCallback === 'function') {
        fnCallback();
    }
}

// Greet user on page load
document.addEventListener('DOMContentLoaded', () => {
    const message = "I'm your virtual personal assistant. How may I help you today?";
    typeWriter(message, 0);
    speak("Hi, I'm Alpha, your virtual personal assistant.");
});
let cameraStream = null;

function openCamera() {
    const video = document.getElementById('camera');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.style.display = 'block';
            video.srcObject = stream;
            cameraStream = stream;
            speak("Opening your camera now.");
        })
        .catch((err) => {
            console.error("Camera access denied:", err);
            speak("I couldn't access your camera. Please allow permission.");
        });
}

function closeCamera() {
  const video = document.getElementById('camera');
  if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
      video.style.display = 'none';
      cameraStream = null;
      speak("Camera closed.");
  } else {
      speak("Camera is not open.");
  }
}


// Respond to recognized speech
function respond(command) {
    const msg = command.toLowerCase();

    if (msg.includes('hello') || msg.includes('hi')) {
        speak("Hello! How can I help you today?");
    } else if (msg.includes('how are you')) {
        speak("I'm doing great! What can I do for you?");
    } else if (msg.includes('your name')) {
        speak("I'm Alpha, your virtual assistant.");
    } else if (msg.includes('how was your day')) {
        speak("My day has been amazing, thanks for asking!");
    } else if (msg.includes('open google')) {
        speak("Opening Google");
        window.open("https://www.google.com", "_blank");
    } else if (msg.includes('thank you')) {
        speak("You're welcome!");
    } else if (msg.includes('open camera')) {
      openCamera();
    }else if (msg.includes('close camera')) {
      closeCamera();
    }else if (msg.includes('search') || msg.includes('google')) {
        const query = msg.replace('search', '').replace('google', '').trim();
        if (query) {
            speak("Searching Google for " + query);
            window.open("https://www.google.com/search?q=" + encodeURIComponent(query), '_blank');
        } else {
            speak("Please tell me what to search for.");
        }
    } else {
        speak("Sorry, I didn't understand that. Please try again.");
    }
}

// On mic button click
talkButton.addEventListener('click', () => {
    content.textContent = 'Listening...';
    recognition.start();
});

// On recognition result
recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    content.textContent = `You said: "${transcript}"`;
    respond(transcript);
};

// On error
recognition.onerror = function () {
    speak("Sorry, I didn't catch that. Please try again.");
    content.textContent = "Sorry, I didn't catch that. Please try again.";
};
