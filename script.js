const headlinesRepository = {
    "Monday": [
        { text: "Monday Headline 1", isReal: true, source: "Source A" },
        { text: "Monday Headline 2", isReal: false, source: "" },
        { text: "Monday Headline 3", isReal: true, source: "Source B" },
        { text: "Monday Headline 4", isReal: false, source: "" },
        { text: "Monday Headline 5", isReal: true, source: "Source C" }
    ],
    "Tuesday": [
        { text: "Tuesday Headline 1", isReal: true, source: "Source D" },
        { text: "Tuesday Headline 2", isReal: false, source: "" },
        { text: "Tuesday Headline 3", isReal: true, source: "Source E" },
        { text: "Tuesday Headline 4", isReal: false, source: "" },
        { text: "Tuesday Headline 5", isReal: true, source: "Source F" }
    ],
    "Wednesday": [
        { text: "Wednesday Headline 1", isReal: true, source: "Source G" },
        { text: "Wednesday Headline 2", isReal: false, source: "" },
        { text: "Wednesday Headline 3", isReal: true, source: "Source H" },
        { text: "Wednesday Headline 4", isReal: false, source: "" },
        { text: "Wednesday Headline 5", isReal: true, source: "Source I" }
    ],
    "Thursday": [
        { text: "Thursday Headline 1", isReal: true, source: "Source J" },
        { text: "Thursday Headline 2", isReal: false, source: "" },
        { text: "Thursday Headline 3", isReal: true, source: "Source K" },
        { text: "Thursday Headline 4", isReal: false, source: "" },
        { text: "Thursday Headline 5", isReal: true, source: "Source L" }
    ],
    "Friday": [
        { text: "Elon Musk admits cheating at video games", isReal: true, source: "Source M" },
        { text: "Study to deliberately infect people with malaria", isReal: true, source: "https://www.bbc.co.uk/news/articles/cj91edgye41o"},
        { text: "Plans announced to replace London Tube drivers with AI within 5 years", isReal: false, source: " " },
        { text: "Trump refuses to provide support to LA amidst wildfires - declares the disaster 'their problem'", isReal: false, source: "" },
        { text: "'Hot garbage': Australians react to smell of 'corpse flower' in bloom", isReal: true, source: "https://www.bbc.com/news/videos/c07kdd1g0e7o"}
    ],
    "Saturday": [
        { text: "Elon Musk admits cheating at video games", isReal: true, source: "Source M" },
        { text: "Study to deliberately infect people with malaria", isReal: true, source: "https://www.bbc.co.uk/news/articles/cj91edgye41o"},
        { text: "Plans announced to replace London Tube drivers with AI within 5 years", isReal: false, source: " " },
        { text: "Trump refuses to provide support to LA amidst wildfires - declares the disaster 'their problem'", isReal: false, source: "" },
        { text: "'Hot garbage': Australians react to smell of 'corpse flower' in bloom", isReal: true, source: "https://www.bbc.com/news/videos/c07kdd1g0e7o"}
    ],
    "Sunday": [
        { text: "Sunday Headline 1", isReal: true, source: "Source S" },
        { text: "Sunday Headline 2", isReal: false, source: "" },
        { text: "Sunday Headline 3", isReal: true, source: "Source T" },
        { text: "Sunday Headline 4", isReal: false, source: "" },
        { text: "Sunday Headline 5", isReal: true, source: "Source U" }
    ]
};

let currentHeadlineIndex = 0;
let correctAnswers = 0;
let headlines = []; // This will store the headlines for the current day

const startButton = document.getElementById("start-button");
const gameSection = document.getElementById("game-page");
const rulesSection = document.getElementById("intro-page");
const headlineText = document.getElementById("headline");
const progress = document.getElementById("progress");
const choiceButtons = document.querySelectorAll(".choice-button");
const helpButton = document.getElementById("help-button");
const sourcesButton = document.getElementById("sources-button");

choiceButtons.forEach(button => button.addEventListener("click", handleChoice));

// Check if we have a firstVisit stored; if not, store today's date
if (!localStorage.getItem('firstVisit')) {
    localStorage.setItem('firstVisit', new Date().toISOString());
  }
  
  // Calculate the number of days since the first visit
  const firstVisit = new Date(localStorage.getItem('firstVisit'));
  const now = new Date();
  const diffTime = now - firstVisit;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 so day one is "Retention_D1"
  
  // Send a GA event for user retention
  gtag('event', 'Retention_D' + diffDays, {
    'event_category': 'User',
    'event_label': 'User Retention',
    'value': diffDays
  });
  

startButton.addEventListener("click", function() {
    // Send GA event for game start
    gtag('event', 'Game_Start', {
      'event_category': 'Game',
      'event_label': 'Game Started'
    });
    startGame();
  });
  
  // For the Help button:
  helpButton.addEventListener("click", function() {
    gtag('event', 'Help_Clicked', {
      'event_category': 'Interaction',
      'event_label': 'Instructions Clicked'
    });
    showHelp(); // (this shows your custom modal)
  });
  
  // For the News Sources button:
  sourcesButton.addEventListener("click", function() {
    gtag('event', 'News_Clicked', {
      'event_category': 'Interaction',
      'event_label': 'News Sources Clicked'
    });
    showSources(); // (this shows your custom modal)
  });
  


// Get today's headlines
function getTodaysHeadlines() {
    const today = new Date().toLocaleDateString("en-GB", { weekday: "long", timeZone: "Europe/London" });
    console.log(`Detected day: ${today}`); // Debugging log

    headlines = headlinesRepository[today] || [];

    if (headlines.length === 0) {
        console.error(`No headlines found for ${today}. Check the headlinesRepository.`);
    } else {
        console.log(`Loaded headlines for ${today}:`, headlines);
    }
}

// Helper function to show the modal with custom content
function showModal(content) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = content;
    modalOverlay.classList.remove('hidden');
  }
  
  // Function to close the modal
  function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
  
  // Replace the default alert for Help with the custom modal
  function showHelp() {
    const helpContent = `
      <h2>Help</h2>
      <p>Welcome to NewsReal! You will see five news headlines from the last week. Three are Real, Two are Fake. Correctly identify which is which!</p>
    `;
    showModal(helpContent);
  }
  
  // Replace the default alert for News Sources with the custom modal
  function showSources() {
    const sourcesContent = `
      <h2>News Sources</h2>
      <p>Our headlines are curated from the following news sources:</p>
      <p>
        The Guardian <br>
        BBC News <br>
        The New York Times <br>
      </p>
    `;
    showModal(sourcesContent);
  }
  
  // Attach event listener to the modal close button
  document.getElementById('modal-close').addEventListener('click', closeModal);
  
  // Optionally, allow closing the modal by clicking outside the modal box:
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  });  

function startGame() {
    getTodaysHeadlines(); // Load today's headlines before starting

    if (headlines.length === 0) {
        console.error("No headlines available. Game cannot start.");
        alert("No headlines available for today. Please check the repository.");
        return;
    }

    rulesSection.classList.add("hidden");
    gameSection.classList.remove("hidden");
    initializeProgressBoxes();
    showNextHeadline();
}

function initializeProgressBoxes() {
    progress.innerHTML = "";
    for (let i = 0; i < headlines.length; i++) {
        const box = document.createElement("div");
        box.className = "progress-box";
        progress.appendChild(box);
    }
}

function showNextHeadline() {
    if (currentHeadlineIndex < headlines.length) {
        const headline = headlines[currentHeadlineIndex];
        headlineText.style.opacity = 0;
        setTimeout(() => {
            headlineText.textContent = `"${headline.text}"`;
            headlineText.style.opacity = 1;
        }, 500);
    } else {
        setTimeout(() => {
            endGame();
        }, 700);
    }
}

function handleChoice(event) {
    const userChoice = event.target.dataset.choice; // 'real' or 'fake'
    const isCorrect = (userChoice === "real") === headlines[currentHeadlineIndex].isReal;

    if (isCorrect) {
        correctAnswers++;
    }

    // Update progress tracker with user's choice
    const progressBox = progress.children[currentHeadlineIndex];
    progressBox.classList.add(userChoice === "real" ? "filled-green" : "filled-red");
    progressBox.style.backgroundColor = userChoice === "real" ? "#6e9ed1" : "#da90eb";

    // Send GA event for progress – tracking the count of questions answered
    gtag('event', 'Progress', {
        'event_category': 'Game',
        'event_label': 'Question Answered',
        'value': currentHeadlineIndex + 1 // questions answered so far
    });

    // Move to the next headline
    currentHeadlineIndex++;
    showNextHeadline();
}

function endGame() {
    document.getElementById("headline-container").classList.add("hidden");
    choiceButtons.forEach(button => button.classList.add("hidden"));
    progress.style.display = "none";

    const endScreen = document.getElementById("end-screen");
    endScreen.classList.remove("hidden");
    endScreen.innerHTML = ''; // Clear previous content

    // Create headings and their containers
    const headings = ['Headline', 'Your Answers', ' '];
    const headingsContainer = document.createElement('div');
    headingsContainer.className = 'end-headings-container';
    endScreen.appendChild(headingsContainer);

    headings.forEach(heading => {
        const headingElement = document.createElement('h3');
        headingElement.textContent = heading;
        headingElement.classList.add('end-heading'); // Add class for styling

        // Create a container for each heading
        const headingContainer = document.createElement('div');
        headingContainer.className = 'end-heading-container';
        headingContainer.appendChild(headingElement);

        headingsContainer.appendChild(headingContainer);
    });

    // Create main container for headlines
    const headlinesContainer = document.createElement('div');
    headlinesContainer.className = 'end-headlines-container';
    endScreen.appendChild(headlinesContainer);

    headlines.forEach((headline, index) => {
        const userSelectedGreen = progress.children[index].classList.contains("filled-green");
        const userSelectedRed = progress.children[index].classList.contains("filled-red");
        const isCorrect = (userSelectedGreen && headline.isReal) || (userSelectedRed && !headline.isReal);

        // Create a container for each headline
        const headlineRow = document.createElement('div');
        headlineRow.className = 'end-headline-row';
        headlinesContainer.appendChild(headlineRow);

        // Headline column
        const headlineBox = document.createElement('div');
        headlineBox.className = 'end-box';
        headlineBox.textContent = `"${headline.text}"`;
        headlineRow.appendChild(headlineBox);

        // Your answers column
        const userAnswerBox = document.createElement('div');
        userAnswerBox.className = 'end-box';
        userAnswerBox.textContent = userSelectedGreen ? "True" : "False";
        headlineRow.appendChild(userAnswerBox);

        // Correct Answers column (initially hidden)
        const correctAnswerBox = document.createElement('div');
        correctAnswerBox.className = 'end-box';
        correctAnswerBox.textContent = isCorrect ? "✅" : "❌";
        correctAnswerBox.classList.add('fade-out');
        headlineRow.appendChild(correctAnswerBox);

        // Fade in the correct answer after a delay
        setTimeout(() => {
            correctAnswerBox.classList.remove('fade-out');
            correctAnswerBox.classList.add('fade-in');
        }, index * 300); // Increased the delay duration
    });

    // Display the user's score
    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "score-display";
    scoreDisplay.textContent = `Your score: ${correctAnswers} / ${headlines.length}`;
    scoreDisplay.style.marginTop = "20px";
    scoreDisplay.style.fontSize = "1.5rem";
    endScreen.appendChild(scoreDisplay);

    // send Score event
    gtag('event', 'Score', {
        'event_category': 'Game',
        'event_label': 'Final Score',
        'value': correctAnswers
    });

    // Add "Come back tomorrow" message
    const message = document.createElement("div");
    message.id = "next-try-message";
    message.textContent = "Come back tomorrow for new headlines!";
    message.style.marginTop = "15px";
    message.style.fontSize = "1.2rem";
    message.style.fontWeight = "bold";
    endScreen.appendChild(message);

    // Add countdown timer
    const countdown = document.createElement("div");
    countdown.id = "countdown-timer";
    countdown.style.marginTop = "10px";
    countdown.style.fontSize = "1.2rem";
    endScreen.appendChild(countdown);

    updateCountdown(); // Start the countdown
    setInterval(updateCountdown, 1000); // Update every second
}

// Function to calculate and update countdown timer
function updateCountdown() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to next midnight

    const timeLeft = midnight - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("countdown-timer").textContent =
        `Next set of headlines in: ${hours}h ${minutes}m ${seconds}s`;
}
