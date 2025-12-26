// Whole Home Treasure Hunt Game

// Game Configuration
const GAME_CONFIG = {
    initialTime: 300, // 5 minutes in seconds
    penaltyTime: 15, // seconds to subtract for wrong order
    invalidCodePenalty: 10, // seconds to subtract for invalid code
    pointsPerCode: 100,
    
    // Treasure hunt codes in the correct order with hint for each location
    treasureCodes: [
        { code: '123', hint: 'Find the old book' },
        { code: '456', hint: 'Check under your pillow' },
        { code: '789', hint: 'I am feeling a little peckish' },
        { code: '321', hint: 'If you see me you can imagine hearing me roar' },
        { code: '654', hint: 'Time for an adventure' },
        { code: '359', hint: 'Feed me, feed me now' },
        { code: '753', hint: 'All work and no play' },
        { code: '852', hint: 'Time to go crafting' },
        { code: '147', hint: 'Time for pizza' },
        { code: '258', hint: 'The treasure awaits at the old artifact'}
    ],
    
    // Bonus codes that give extra time
    bonusCodes: [
        { code: '999', bonusTime: 30, message: 'Super Bonus! +30 seconds!' },
        { code: '777', bonusTime: 20, message: 'Lucky 7s! +20 seconds!' },
        { code: '555', bonusTime: 15, message: 'Nice Find! +15 seconds!' },
        { code: '111', bonusTime: 25, message: 'Jackpot! +25 seconds!' }
    ],
    
    // Misdirection codes that subtract time (traps!)
    misdirectionCodes: [
        { code: '666', penalty: 25, message: '💣 BOOM! Trap triggered! -25 seconds!' },
        { code: '000', penalty: 20, message: '💥 Explosion! -20 seconds!' },
        { code: '444', penalty: 15, message: '🧨 Oops! You hit a trap! -15 seconds!' },
        { code: '888', penalty: 30, message: '💣 Big Trap! -30 seconds!' }
    ]
};

// Game State
let gameState = {
    timeRemaining: GAME_CONFIG.initialTime,
    currentTreasureIndex: 0,
    foundCodes: [],
    usedBonusCodes: [],
    points: 0,
    penalties: 0,
    timerInterval: null,
    gameOver: false,
    warningPlayed: false
};

// DOM Elements
const timerElement = document.getElementById('timer');
const codeInput = document.getElementById('codeInput');
const submitBtn = document.getElementById('submitBtn');
const messageElement = document.getElementById('message');
const currentHintElement = document.getElementById('currentHint');
const treasuresFoundElement = document.getElementById('treasuresFound');
const totalTreasuresElement = document.getElementById('totalTreasures');
const progressBarElement = document.getElementById('progressBar');
const pointsElement = document.getElementById('points');
const penaltiesElement = document.getElementById('penalties');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');

// Initialize Game
function initGame() {
    gameState = {
        timeRemaining: GAME_CONFIG.initialTime,
        currentTreasureIndex: 0,
        foundCodes: [],
        usedMisdirectionCodes: [],
        usedBonusCodes: [],
        points: 0,
        penalties: 0,
        timerInterval: null,
        gameOver: false,
        warningPlayed: false
    };
    
    updateDisplay();
    updateHint();
    startTimer();
    codeInput.focus();
    gameOverModal.classList.remove('active');
    messageElement.textContent = '';
    messageElement.className = 'message';
}

// Start Timer
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameOver) {
            gameState.timeRemaining--;
            updateTimer();
            
            if (gameState.timeRemaining <= 0) {
                endGame(false);
            }
        }
    }, 1000);
}

// Update Timer Display
function updateTimer() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Add warning class when time is low
    if (gameState.timeRemaining <= 60) {
        timerElement.classList.add('warning');
        // Play warning sound when first entering warning zone
        if (!gameState.warningPlayed) {
            playAudio(AUDIO_FILES.warning);
            gameState.warningPlayed = true;
        }
    } else {
        timerElement.classList.remove('warning');
    }
}

// Update All Display Elements
function updateDisplay() {
    updateTimer();
    treasuresFoundElement.textContent = gameState.foundCodes.length;
    totalTreasuresElement.textContent = GAME_CONFIG.treasureCodes.length;
    pointsElement.textContent = gameState.points;
    penaltiesElement.textContent = gameState.penalties;
    
    // Update progress bar
    const progress = (gameState.foundCodes.length / GAME_CONFIG.treasureCodes.length) * 100;
    progressBarElement.style.width = `${progress}%`;
}

// Audio Configuration - Update these paths to your MP3 files
const AUDIO_FILES = {
    explosion: 'sounds/explosion.mp3',
    bonus: 'sounds/bonus.mp3',
    treasure: 'sounds/treasure.mp3',
    success: 'sounds/success.mp3',
    fail: 'sounds/fail.mp3',
    warning: 'sounds/warning.mp3',
    ding: 'sounds/ding.mp3'
};

// Helper function to play audio
function playAudio(audioFile) {
    const audio = new Audio(audioFile);
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
}

// Play Explosion Sound
function playExplosionSound() {
    playAudio(AUDIO_FILES.explosion);
}

// Play Bonus Sound
function playBonusSound() {
    playAudio(AUDIO_FILES.bonus);
}

// Play Treasure Found Sound
function playTreasureSound() {
    playAudio(AUDIO_FILES.treasure);
}

// Play Big Success Sound (All Treasures Found)
function playBigSuccessSound() {
    playAudio(AUDIO_FILES.success);
}

// Play Fail Sound (Time Ran Out)
function playFailSound() {
    playAudio(AUDIO_FILES.fail);
}

// 

// Update Hint
function updateHint() {
    if (gameState.currentTreasureIndex < GAME_CONFIG.treasureCodes.length) {
        currentHintElement.textContent = GAME_CONFIG.treasureCodes[gameState.currentTreasureIndex].hint;
    } else {
        currentHintElement.textContent = '🎉 All treasures found! Awaiting final results...';
    }
}

// Show Message
function showMessage(text, type, duration = 3000) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, duration);
}

// Handle Code Submission
function submitCode() {
    if (gameState.gameOver) return;
    
    const code = codeInput.value.trim();
    
    if (code.length !== 3 || !/^\d{3}$/.test(code)) {
        showMessage('Please enter a 3-digit code!', 'error');
        codeInput.value = '';
        return;
    }
    
    // Check if it's the correct treasure code
    const expectedTreasure = GAME_CONFIG.treasureCodes[gameState.currentTreasureIndex];
    
    if (code === expectedTreasure?.code) {
        // Correct code in correct order
        gameState.foundCodes.push(code);
        gameState.points += GAME_CONFIG.pointsPerCode;
        gameState.currentTreasureIndex++;
        
        playTreasureSound();
        showMessage(`🎉 Correct! You found treasure #${gameState.foundCodes.length}!`, 'success');
        updateDisplay();
        updateHint();
        
        // Check if all treasures are found
        if (gameState.currentTreasureIndex >= GAME_CONFIG.treasureCodes.length) {
            endGame(true);
        }
    } 
    // Check if it's a misdirection code (trap!)
    else if (GAME_CONFIG.misdirectionCodes.some(m => m.code === code)) {
        const trap = GAME_CONFIG.misdirectionCodes.find(m => m.code === code);
        
        if (gameState.usedMisdirectionCodes.includes(code)) {
            showMessage('You already triggered this trap!', 'error');
        } else {
            gameState.usedMisdirectionCodes.push(code);
            gameState.timeRemaining = Math.max(0, gameState.timeRemaining - trap.penalty);
            gameState.penalties++;
            playExplosionSound();
            showMessage(trap.message, 'error');
            updateDisplay();
            
            if (gameState.timeRemaining <= 0) {
                endGame(false);
            }
        }
    }
    // Check if it's a valid treasure code but out of order
    else if (GAME_CONFIG.treasureCodes.some(t => t.code === code)) {
        if (gameState.foundCodes.includes(code)) {
            showMessage('You already found this treasure!', 'error');
        } else {
            // Wrong order - apply penalty
            gameState.timeRemaining = Math.max(0, gameState.timeRemaining - GAME_CONFIG.penaltyTime);
            gameState.penalties++;
            showMessage(`❌ Wrong order! -${GAME_CONFIG.penaltyTime} seconds penalty!`, 'error');
            updateDisplay();
            
            if (gameState.timeRemaining <= 0) {
                endGame(false);
            }
        }
    }
    // Check if it's a bonus code
    else if (GAME_CONFIG.bonusCodes.some(b => b.code === code)) {
        const bonus = GAME_CONFIG.bonusCodes.find(b => b.code === code);
        
        if (gameState.usedBonusCodes.includes(code)) {
            showMessage('You already used this bonus code!', 'error');
        } else {
            gameState.usedBonusCodes.push(code);
            gameState.timeRemaining += bonus.bonusTime;
            playBonusSound();
            gameState.points += 50; // Bonus points
            showMessage(`⭐ ${bonus.message}`, 'bonus');
            updateDisplay();
        }
    }
    // Invalid code
    else {
        gameState.timeRemaining = Math.max(0, gameState.timeRemaining - GAME_CONFIG.invalidCodePenalty);
        gameState.penalties++;
        playAudio(AUDIO_FILES.ding);
        showMessage(`❌ Invalid code! -${GAME_CONFIG.invalidCodePenalty} seconds penalty!`, 'error', 5000);
        updateDisplay();
        
        if (gameState.timeRemaining <= 0) {
            endGame(false);
        }
    }
    
    codeInput.value = '';
    codeInput.focus();
}

// End Game
function endGame(won) {
    gameState.gameOver = true;
    clearInterval(gameState.timerInterval);
    
    if (won) {
        playBigSuccessSound();
        gameOverTitle.textContent = '🎊 CONGRATULATIONS! 🎊';
        gameOverMessage.innerHTML = `
            You found all the treasures and won the prize!<br><br>
            <strong>Final Score: ${gameState.points} points</strong><br>
            Time Remaining: ${Math.floor(gameState.timeRemaining / 60)}:${(gameState.timeRemaining % 60).toString().padStart(2, '0')}<br>
            Penalties: ${gameState.penalties}
        `;
    } else {
        playFailSound();
        gameOverTitle.textContent = '⏰ Time\'s Up! ⏰';
        gameOverMessage.innerHTML = `
            You ran out of time!<br><br>
            Treasures Found: ${gameState.foundCodes.length} / ${GAME_CONFIG.treasureCodes.length}<br>
            <strong>Score: ${gameState.points} points</strong><br>
            Better luck next time!
        `;
    }
    
    gameOverModal.classList.add('active');
}

// Event Listeners
submitBtn.addEventListener('click', submitCode);

codeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitCode();
    }
});

// Only allow numbers in code input
codeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

restartBtn.addEventListener('click', initGame);

// Start game on load
window.addEventListener('load', initGame);
