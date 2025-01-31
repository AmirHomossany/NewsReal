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
        { text: "'Hot garbage': Australians react to smell of 'corpse flower' in bloom", isReal: true, source: "https://www.bbc.com/news/videos/c07kdd1g0e7o" }
    ],
    "Saturday": [
        { text: "Saturday Headline 1", isReal: true, source: "Source P" },
        { text: "Saturday Headline 2", isReal: false, source: "" },
        { text: "Saturday Headline 3", isReal: true, source: "Source Q" },
        { text: "Saturday Headline 4", isReal: false, source: "" },
        { text: "Saturday Headline 5", isReal: true, source: "Source R" }
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

startButton.addEventListener("click", startGame);
choiceButtons.forEach(button => button.addEventListener("click", handleChoice));

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

    headlines.forEach((headline, index) => {
        const userSelectedGreen = progress.children[index].classList.contains("filled-green");
        const userSelectedRed = progress.children[index].classList.contains("filled-red");

        const endBox = document.createElement("div");
        endBox.className = "end-box";
        endBox.style.backgroundColor = userSelectedGreen ? "#6e9ed1" : "#da90eb";
        endBox.textContent = `"${headline.text}"`;

        const indicator = document.createElement("div");
        indicator.className = "indicator";
        indicator.style.opacity = 0;
        indicator.style.transition = "opacity 0.5s ease";
        indicator.style.marginLeft = "8px";

        const userWasCorrect = (headline.isReal && userSelectedGreen) || (!headline.isReal && userSelectedRed);
        indicator.textContent = userWasCorrect ? "✔️" : "✖️";
        indicator.style.color = userWasCorrect ? "#4CAF50" : "#F44336";

        const contentWrapper = document.createElement("div");
        contentWrapper.className = "end-content";
        contentWrapper.appendChild(endBox);
        contentWrapper.appendChild(indicator);

        const container = document.createElement("div");
        container.className = "end-container";
        container.appendChild(contentWrapper);

        endScreen.appendChild(container);

        setTimeout(() => {
            indicator.style.opacity = 1;
        }, index * 500);
    });

    // Display the user's score
    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "score-display";
    scoreDisplay.textContent = `Your score: ${correctAnswers} / ${headlines.length}`;
    scoreDisplay.style.marginTop = "20px";
    scoreDisplay.style.fontSize = "1.5rem";
    endScreen.appendChild(scoreDisplay);

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