/* ==========================================================================
   DII'S BIRTHDAY CELEBRATION JAVASCRIPT LOGIC
   Features: Particle Canvas, Web Audio Melodies, Confetti, Wish Storage, Quiz
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --------------------------------------------------------------------------
    // 1. BACKGROUND PARTICLE CANVAS (Floating Hearts & Sparkles)
    // --------------------------------------------------------------------------
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");

    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 50;
            this.size = Math.random() * 14 + 8;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = Math.sin(this.y * 0.01) * 0.8;
            this.opacity = Math.random() * 0.6 + 0.3;
            this.color = ["#ff5e97", "#a855f7", "#ffd700", "#ff7eb3"][Math.floor(Math.random() * 4)];
            this.isHeart = Math.random() > 0.4;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.02) * 0.5;

            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.isHeart) {
                // Draw Heart Shape
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                const topCurveHeight = this.size * 0.3;
                ctx.moveTo(0, topCurveHeight);
                ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
                ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
                ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
                ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
                ctx.fill();
            } else {
                // Draw Star / Sparkle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize 45 particles
    for (let i = 0; i < 45; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --------------------------------------------------------------------------
    // 2. WEB AUDIO API SYNTHESIZER (Happy Birthday Melody & Sound Effects)
    // --------------------------------------------------------------------------
    let audioCtx = null;
    let isPlayingSong = false;
    let songInterval = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Play a single note tone
    function playTone(freq, duration, type = "sine", delay = 0) {
        try {
            const ctx = getAudioContext();
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(ctx.currentTime + duration);
            }, delay);
        } catch (e) {
            console.log("Audio not supported or blocked");
        }
    }

    // Happy Birthday Frequencies (Hz)
    const notes = {
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
        A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, F5: 698.46
    };

    const songMelody = [
        { note: notes.C4, duration: 0.3, delay: 0 },
        { note: notes.C4, duration: 0.3, delay: 400 },
        { note: notes.D4, duration: 0.6, delay: 800 },
        { note: notes.C4, duration: 0.6, delay: 1400 },
        { note: notes.F4, duration: 0.6, delay: 2000 },
        { note: notes.E4, duration: 1.0, delay: 2600 },

        { note: notes.C4, duration: 0.3, delay: 3600 },
        { note: notes.C4, duration: 0.3, delay: 4000 },
        { note: notes.D4, duration: 0.6, delay: 4400 },
        { note: notes.C4, duration: 0.6, delay: 5000 },
        { note: notes.G4, duration: 0.6, delay: 5600 },
        { note: notes.F4, duration: 1.0, delay: 6200 },

        { note: notes.C4, duration: 0.3, delay: 7200 },
        { note: notes.C4, duration: 0.3, delay: 7600 },
        { note: notes.C5, duration: 0.6, delay: 8000 },
        { note: notes.A4, duration: 0.6, delay: 8600 },
        { note: notes.F4, duration: 0.6, delay: 9200 },
        { note: notes.E4, duration: 0.6, delay: 9800 },
        { note: notes.D4, duration: 0.8, delay: 10400 }
    ];

    function playHappyBirthdaySong() {
        if (isPlayingSong) return;
        isPlayingSong = true;

        const musicBtn = document.getElementById("musicToggle");
        const musicText = document.getElementById("musicText");
        musicBtn.classList.add("playing");
        musicText.textContent = "Pause Song ⏸️";

        function runLoop() {
            songMelody.forEach((item) => {
                if (isPlayingSong) {
                    playTone(item.note, item.duration, "triangle", item.delay);
                }
            });
        }

        runLoop();
        songInterval = setInterval(() => {
            if (isPlayingSong) runLoop();
        }, 11500);
    }

    function stopHappyBirthdaySong() {
        isPlayingSong = false;
        if (songInterval) clearInterval(songInterval);
        const musicBtn = document.getElementById("musicToggle");
        const musicText = document.getElementById("musicText");
        musicBtn.classList.remove("playing");
        musicText.textContent = "Play Song 🎵";
    }

    document.getElementById("musicToggle").addEventListener("click", () => {
        if (isPlayingSong) {
            stopHappyBirthdaySong();
        } else {
            playHappyBirthdaySong();
        }
    });

    // Sound effect trigger helper
    function playSparkleSound() {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            playTone(freq, 0.2, "sine", idx * 80);
        });
    }


    // --------------------------------------------------------------------------
    // 3. CANDLE BLOWING & FIREWORKS LOGIC
    // --------------------------------------------------------------------------
    const blowCandleBtn = document.getElementById("blowCandleBtn");
    const fireworksBtn = document.getElementById("fireworksBtn");
    const cakeWrapper = document.getElementById("cakeWrapper");
    const candlesOverlay = document.getElementById("candlesOverlay");
    const cakeBanner = document.getElementById("cakeBanner");

    let candlesBlown = false;

    function triggerConfetti() {
        if (typeof confetti === "function") {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                confetti({
                    particleCount: 60,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 60,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 250);
        }
    }

    function blowOutCandles() {
        if (candlesBlown) {
            // Already blown out, just trigger confetti
            triggerConfetti();
            playSparkleSound();
            return;
        }

        candlesBlown = true;
        document.querySelectorAll(".flame").forEach((flame) => {
            flame.classList.add("blown-out");
        });

        cakeBanner.innerHTML = `✨ Wish Granted! Happy Birthday Dii! 🎉 ✨`;
        cakeBanner.style.background = "linear-gradient(135deg, #ff5e97, #ffd700)";
        cakeBanner.style.color = "#ffffff";

        playSparkleSound();
        triggerConfetti();
        if (!isPlayingSong) playHappyBirthdaySong();
    }

    blowCandleBtn.addEventListener("click", blowOutCandles);
    cakeWrapper.addEventListener("click", blowOutCandles);

    fireworksBtn.addEventListener("click", () => {
        triggerConfetti();
        playSparkleSound();
    });


    // --------------------------------------------------------------------------
    // 4. POLAROID LIGHTBOX MODAL
    // --------------------------------------------------------------------------
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const modalClose = document.getElementById("modalClose");

    document.querySelectorAll(".polaroid-card").forEach((card) => {
        card.addEventListener("click", () => {
            const imgSrc = card.getAttribute("data-img");
            const caption = card.getAttribute("data-caption");
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightboxModal.classList.remove("hidden");
            playSparkleSound();
        });
    });

    modalClose.addEventListener("click", () => {
        lightboxModal.classList.add("hidden");
    });

    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.add("hidden");
        }
    });


    // --------------------------------------------------------------------------
    // 5. SURPRISE GIFT BOX UNWRAPPING
    // --------------------------------------------------------------------------
    document.querySelectorAll(".gift-box").forEach((box) => {
        box.addEventListener("click", () => {
            if (!box.classList.contains("opened")) {
                box.classList.add("opened");
                playSparkleSound();
                if (typeof confetti === "function") {
                    confetti({
                        particleCount: 40,
                        spread: 50,
                        origin: { y: 0.7 }
                    });
                }
            }
        });
    });


    // --------------------------------------------------------------------------
    // 6. WISH WALL & STORAGE LOGIC
    // --------------------------------------------------------------------------
    const defaultWishes = [
        {
            sender: "Your Brother",
            message: "Happy Birthday Dii! Thank you for being the most supportive, funny, and amazing sister. Hope your year ahead is filled with success and happiness! ❤️",
            emoji: "👑",
            time: "Just now"
        },
        {
            sender: "Family & Loved Ones",
            message: "Wishing you a fantastic birthday Dii! May all your big dreams come true this year!",
            emoji: "💖",
            time: "Today"
        },
        {
            sender: "Secret Admirer",
            message: "World's #1 Sister award officially goes to you! Have an incredible celebration! 🎉",
            emoji: "🌟",
            time: "Today"
        }
    ];

    function getSavedWishes() {
        const stored = localStorage.getItem("dii_birthday_wishes");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return defaultWishes;
            }
        }
        return defaultWishes;
    }

    function renderWishes() {
        const wishes = getSavedWishes();
        const grid = document.getElementById("wishesGrid");
        grid.innerHTML = "";

        wishes.forEach((w) => {
            const card = document.createElement("div");
            card.className = "wish-card";
            card.innerHTML = `
                <div class="wish-card-header">
                    <span class="wish-sender">${escapeHtml(w.sender)}</span>
                    <span class="wish-emoji">${w.emoji}</span>
                </div>
                <div class="wish-body">${escapeHtml(w.message)}</div>
                <div class="wish-time">${w.time || "Recently"}</div>
            `;
            grid.appendChild(card);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // Emoji picker selection
    let selectedEmoji = "💖";
    const emojiOpts = document.querySelectorAll(".emoji-opt");
    emojiOpts.forEach((opt) => {
        opt.addEventListener("click", () => {
            emojiOpts.forEach((o) => o.classList.remove("active"));
            opt.classList.add("active");
            selectedEmoji = opt.getAttribute("data-emoji");
        });
    });

    // Submit Wish Form
    const wishForm = document.getElementById("wishForm");
    wishForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const sender = document.getElementById("senderName").value.trim();
        const message = document.getElementById("wishMessage").value.trim();

        if (sender && message) {
            const wishes = getSavedWishes();
            wishes.unshift({
                sender: sender,
                message: message,
                emoji: selectedEmoji,
                time: "Just now"
            });
            localStorage.setItem("dii_birthday_wishes", JSON.stringify(wishes));
            renderWishes();
            wishForm.reset();
            triggerConfetti();
            playSparkleSound();
        }
    });

    // Random Compliment Generator
    const compliments = [
        "Dii is literally the sweetest person ever!",
        "May your birthday be as fabulous as your fashion sense!",
        "Wishing you a year filled with endless laughter, Boba, and joy!",
        "You deserve all the happiest things in the world today!",
        "Best sister, best friend, best secret keeper!"
    ];

    document.getElementById("randomWishBtn").addEventListener("click", () => {
        const randomMsg = compliments[Math.floor(Math.random() * compliments.length)];
        document.getElementById("wishMessage").value = randomMsg;
        playSparkleSound();
    });

    renderWishes();


    // --------------------------------------------------------------------------
    // 7. SISTER TRIVIA QUIZ
    // --------------------------------------------------------------------------
    const quizQuestions = [
        {
            q: "What makes Dii the best sister in the world?",
            options: [
                "Her awesome sense of humor & kindness",
                "She always listens and gives great advice",
                "Her incredible smile & positivity",
                "All of the above! 👑"
            ],
            correct: 3
        },
        {
            q: "If Dii had a superhero identity, what would it be?",
            options: [
                "Captain Happiness",
                "Master of Midnight Snacks 🍕",
                "The Sunshine Generator ☀️",
                "Queen of Everything ✨"
            ],
            correct: 3
        },
        {
            q: "What is the official birthday motto for Dii today?",
            options: [
                "Eat cake, make wishes, be happy!",
                "Celebrate like a Queen! 👑",
                "More laughter, less stress!",
                "All of these forever! 🎉"
            ],
            correct: 3
        }
    ];

    let currentQ = 0;
    let score = 0;

    function renderQuiz() {
        if (currentQ >= quizQuestions.length) {
            // Show result
            document.getElementById("quizContent").classList.add("hidden");
            document.getElementById("quizResult").classList.remove("hidden");
            document.getElementById("quizScoreText").textContent = `You scored ${score} out of ${quizQuestions.length}! Dii is super proud of you! 💖`;
            triggerConfetti();
            playSparkleSound();
            return;
        }

        const data = quizQuestions[currentQ];
        document.getElementById("qNum").textContent = currentQ + 1;
        document.getElementById("quizQuestion").textContent = data.q;

        const optsContainer = document.getElementById("quizOptions");
        optsContainer.innerHTML = "";

        data.options.forEach((optText, idx) => {
            const btn = document.createElement("button");
            btn.className = "quiz-opt-btn";
            btn.textContent = optText;
            btn.addEventListener("click", () => {
                if (idx === data.correct) score++;
                currentQ++;
                playSparkleSound();
                renderQuiz();
            });
            optsContainer.appendChild(btn);
        });
    }

    document.getElementById("restartQuizBtn").addEventListener("click", () => {
        currentQ = 0;
        score = 0;
        document.getElementById("quizResult").classList.add("hidden");
        document.getElementById("quizContent").classList.remove("hidden");
        renderQuiz();
    });

    renderQuiz();


    // --------------------------------------------------------------------------
    // 8. SECRET LETTER MODAL
    // --------------------------------------------------------------------------
    const secretVaultBtn = document.getElementById("secretVaultBtn");
    const letterModal = document.getElementById("letterModal");
    const letterClose = document.getElementById("letterClose");
    const letterDismissBtn = document.getElementById("letterDismissBtn");

    secretVaultBtn.addEventListener("click", () => {
        letterModal.classList.remove("hidden");
        playSparkleSound();
    });

    letterClose.addEventListener("click", () => {
        letterModal.classList.add("hidden");
    });

    letterDismissBtn.addEventListener("click", () => {
        letterModal.classList.add("hidden");
        triggerConfetti();
    });

    letterModal.addEventListener("click", (e) => {
        if (e.target === letterModal) {
            letterModal.classList.add("hidden");
        }
    });

});