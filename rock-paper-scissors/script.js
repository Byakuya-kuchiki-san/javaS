let userScore = 0;
let compScore = 0;
const WIN_TARGET = 5;

const choices = document.querySelectorAll(".choice");
const userScoreElem = document.getElementById("userScore");
const compScoreElem = document.getElementById("compScore");
const resultElem = document.getElementById("result");
const progressFill = document.getElementById("progressFill");
const trackerScore = document.getElementById("trackerScore");
const unlockModal = document.getElementById("unlockModal");
const countdownElem = document.getElementById("countdown");

const generateComputerScore = () => {
    const choiceList = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choiceList[randomIndex];
};

const updateProgress = () => {
    userScoreElem.innerText = userScore;
    compScoreElem.innerText = compScore;
    
    // Calculate progress percentage up to 100%
    const pct = Math.min(100, Math.round((userScore / WIN_TARGET) * 100));
    progressFill.style.width = `${pct}%`;
    trackerScore.innerText = `${userScore}/${WIN_TARGET} Wins`;
};

const reset = () => {
    userScore = 0;
    compScore = 0;
    updateProgress();
    resultElem.innerText = "Place your move";
};

// Web Audio API Synthesizer Fanfare
const playFanfareSound = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            }, i * 120);
        });
    } catch (e) {
        console.log("Audio play blocked or unavailable");
    }
};

const triggerBirthdayUnlock = () => {
    // Fire celebration fanfare & confetti
    playFanfareSound();
    
    if (typeof confetti === "function") {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 300);
    }

    // Display modal
    unlockModal.classList.remove("hidden");

    // Start 3 second countdown redirect
    let timeLeft = 3;
    countdownElem.innerText = timeLeft;

    const navigateToBirthday = () => {
        // Encoded path works both locally & on GitHub Pages
        const targetUrl = encodeURI("../Dii's birthday/index.html");
        window.location.href = targetUrl;
    };

    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            countdownElem.innerText = timeLeft;
        } else {
            clearInterval(timer);
            navigateToBirthday();
        }
    }, 1000);
};

const playGame = (userChoice) => {
    const computerChoice = generateComputerScore();

    if (userChoice === computerChoice) {
        resultElem.innerHTML = `Draw! Both chose <strong>${userChoice}</strong> 🤝`;
    } else {
        // Correct win conditions check for "rock", "paper", "scissors"
        const isUserWin = 
            (userChoice === "rock" && computerChoice === "scissors") ||
            (userChoice === "paper" && computerChoice === "rock") ||
            (userChoice === "scissors" && computerChoice === "paper");

        if (isUserWin) {
            userScore++;
            resultElem.innerHTML = `You chose <strong>${userChoice}</strong> & Computer chose <strong>${computerChoice}</strong>. <strong>You Win! 🎉</strong>`;
        } else {
            compScore++;
            resultElem.innerHTML = `You chose <strong>${userChoice}</strong> & Computer chose <strong>${computerChoice}</strong>. <strong>Computer Wins! 💻</strong>`;
        }
    }

    updateProgress();

    // Trigger birthday execution after 5 wins!
    if (userScore >= WIN_TARGET) {
        setTimeout(() => {
            triggerBirthdayUnlock();
        }, 500);
    }
};

document.getElementById("resetBtn").addEventListener("click", () => {
    reset();
});

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const choiceId = choice.getAttribute("id");
        playGame(choiceId);
    });
});
