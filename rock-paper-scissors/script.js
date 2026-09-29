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

// Dynamically compute relative path based on location
const getTargetBirthdayUrl = () => {
    const pathname = window.location.pathname;
    // If page is loaded from inside /rock-paper-scissors/ subfolder
    if (pathname.includes('/rock-paper-scissors/')) {
        return "../Dii-birthday/index.html";
    }
    // If page is loaded from root / or /index.html
    return "./Dii-birthday/index.html";
};

document.addEventListener("DOMContentLoaded", () => {
    const directBtn = document.getElementById("directLaunchBtn");
    if (directBtn) {
        directBtn.href = encodeURI(getTargetBirthdayUrl());
    }
});

const generateComputerScore = () => {
    const choiceList = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choiceList[randomIndex];
};

const updateProgress = () => {
    if (userScoreElem) userScoreElem.innerText = userScore;
    if (compScoreElem) compScoreElem.innerText = compScore;
    
    const pct = Math.min(100, Math.round((userScore / WIN_TARGET) * 100));
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (trackerScore) trackerScore.innerText = `${userScore}/${WIN_TARGET} Wins`;
};

const reset = () => {
    userScore = 0;
    compScore = 0;
    updateProgress();
    if (resultElem) resultElem.innerText = "Place your move";
};

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

    if (unlockModal) unlockModal.classList.remove("hidden");

    const targetUrl = getTargetBirthdayUrl();
    const directBtn = document.getElementById("directLaunchBtn");
    if (directBtn) directBtn.href = encodeURI(targetUrl);

    let timeLeft = 3;
    if (countdownElem) countdownElem.innerText = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            if (countdownElem) countdownElem.innerText = timeLeft;
        } else {
            clearInterval(timer);
            window.location.href = encodeURI(targetUrl);
        }
    }, 1000);
};

const playGame = (userChoice) => {
    const computerChoice = generateComputerScore();

    if (userChoice === computerChoice) {
        if (resultElem) resultElem.innerHTML = `Draw! Both chose <strong>${userChoice}</strong> 🤝`;
    } else {
        const isUserWin = 
            (userChoice === "rock" && computerChoice === "scissors") ||
            (userChoice === "paper" && computerChoice === "rock") ||
            (userChoice === "scissors" && computerChoice === "paper");

        if (isUserWin) {
            userScore++;
            if (resultElem) resultElem.innerHTML = `You chose <strong>${userChoice}</strong> & Computer chose <strong>${computerChoice}</strong>. <strong>You Win! 🎉</strong>`;
        } else {
            compScore++;
            if (resultElem) resultElem.innerHTML = `You chose <strong>${userChoice}</strong> & Computer chose <strong>${computerChoice}</strong>. <strong>Computer Wins! 💻</strong>`;
        }
    }

    updateProgress();

    if (userScore >= WIN_TARGET) {
        setTimeout(() => {
            triggerBirthdayUnlock();
        }, 500);
    }
};

const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        reset();
    });
}

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const choiceId = choice.getAttribute("id");
        playGame(choiceId);
    });
});
