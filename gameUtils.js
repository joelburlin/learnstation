
import { lions, createLions, moveLions, handleLionSelection } from './lions.js';
import { generateMathQuestion, calculateSelectedLionSum, showMathQuiz } from './math.js';

let currentCharacterConfig = null;

let numberOfLions = 8;
const gameArea = document.getElementById('game');
const eatingSound = document.getElementById('hitSound');


let boostActive = false;
const hitSound = document.getElementById('hitSound');
let score = 0;
let lastBoostIconTime = Date.now(); // Keep track of last time the boost icon was shown
let boostTimeout;
let level = 1;
let boostIcon;
let selectedSum=0;

export function updateGameScore(newScore) {
    score += newScore;
    document.getElementById('score').innerText = `${score}`;
}

export function resetLevelWithMessage(message) {
    // Calculate the difference between the selected sum and the quiz answer
    const selectedSum = calculateSelectedLionSum();
    const difference = Math.abs(selectedSum - window.quizAnswer);

    // Prepare the message content for the modal
    let modalMessage = `<h2 class="modal-message">${message}</h2>`;
    if (selectedSum > window.quizAnswer) {
        modalMessage += `<p class="modal-message">You selected ${selectedSum}, which is ${difference} more than the answer.</p>`;
    } else {
        modalMessage += `<p class="modal-message">You selected ${selectedSum}, which is ${difference} less than the answer.</p>`;
    }

    // Set modal content and display the modal
    const modalContent = document.getElementById('levelCompleteModal').querySelector('.modal-content');
    modalContent.innerHTML = modalMessage;
    document.getElementById('levelCompleteModal').style.display = 'block';

    // Apply jumping effect to the dinosaur
    document.getElementById('dinosaur').classList.add('jumping');

    // Reset the selected lions and score
    document.querySelectorAll('.lion').forEach(lion => {
        lion.classList.remove('selected');
        lion.style.display = 'block';
    });
    document.getElementById('score').innerText = `Score: 0`;
    document.getElementById('selectedLionCount').innerText = `0`;


}



// Function to start the game with character configuration
export async function startGame(characterName) {
    const characterConfig = await fetchCharacterConfig();

    if (characterName && characterConfig[characterName]) {
        currentCharacterConfig = characterConfig[characterName]; // Update global config

        applyCharacterSettings(); // Apply settings based on global config

        // Show game area and hide welcome screen
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        document.getElementById('score').style.display = 'block';

        // Start the math quiz after character selection
        startLevelWithMathQuiz();
    } else {
        console.error('Character configuration not found for:', characterName);
    }
};

// Update the function to display the math quiz

export function startLevelWithMathQuiz() {
    const mathQuiz = generateMathQuestion(); // Get a new math question
    window.quizAnswer = mathQuiz.answer; // Store the answer globally

    displayMathQuiz(mathQuiz.question); // Display the question
    debugger;
    createLions(mathQuiz.answer * 2, currentCharacterConfig ? currentCharacterConfig.lionImage : null, true,  mathQuiz.answer); // Create lions based on the quiz answer
}


function displayMathQuiz(question) {
    const questionElement = document.getElementById('mathQuestion'); // Get the element where the question should be displayed
    questionElement.textContent = question; // Update the text content with the new question
}



 
function applyCharacterSettings() {
    if (currentCharacterConfig) {
        const settings = currentCharacterConfig;
        dinosaur.style.backgroundImage = `url('${settings.image}')`;
        gameArea.style.backgroundImage = `url('${settings.backgroundImage}')`;

        movingSound.src = settings.movingSound;
        eatingSound.src = settings.eatingSound;
        lions.forEach(lion => lion.remove()); // Clear existing lions

        //  createLions(numberOfLions, settings.lionImage); // Use global config for lion image
        //createLions(quizAnswer, currentCharacterConfig ? currentCharacterConfig.lionImage : null, true, quizAnswer);

    }
}

// Function to activate speed boost
export function showBoostIcon() {
    // Only show boost icon if it's not already displayed
    if (boostIcon.style.display === 'none') {
        // Randomly position the boost icon within the visible area of the game
        const maxLeft = window.innerWidth - boostIcon.offsetWidth;
        const maxTop = window.innerHeight - boostIcon.offsetHeight;
        boostIcon.style.left = Math.random() * maxLeft + 'px';
        boostIcon.style.top = Math.random() * maxTop + 'px';
        boostIcon.style.display = 'block';

        // Determine a random duration between 10 to 20 seconds
        const duration = 10000 + Math.random() * 10000;

        // Hide the boost icon after the duration and activate speed boost if not clicked
        boostTimeout = setTimeout(function () {
            boostIcon.style.display = 'none';
            activateBoost();
        }, duration);
    }
}
export function activateBoost() {
    boostActive = true;

    // Set a timeout to deactivate the boost after 10 seconds
    setTimeout(function () {
        boostActive = false;
    }, 10000); // Speed boost lasts for 10 seconds
}

// Function to create boost icon
export function createBoostIcon() {
    boostIcon = document.createElement('div');
    boostIcon.id = 'boostIcon';
    boostIcon.style.position = 'absolute';
    boostIcon.style.width = '150px'; // Adjust size as needed
    boostIcon.style.height = '150px';
    boostIcon.style.backgroundImage = 'url("images/cereal.png")'; // Path to your Cheerios icon
    boostIcon.style.backgroundSize = 'contain';
    boostIcon.style.display = 'none';
    gameArea.appendChild(boostIcon);

    // Event listener for clicking the boost icon
    boostIcon.addEventListener('click', function () {
        clearTimeout(boostTimeout);
        boostIcon.style.display = 'none';
    });
}

// Function to check collision with lions
export function checkCollision() {
    console.log("collission")

    console.log("score", score)
    console.log("quiz answer", window.quizAnswer)
    const dinoRect = dinosaur.getBoundingClientRect();
     // Check collision with lions
    lions.forEach((lion, index) => {
        if (lion.style.display !== 'none') {
            const lionRect = lion.getBoundingClientRect();
            if (dinoRect.left < lionRect.right && dinoRect.right > lionRect.left &&
                dinoRect.top < lionRect.bottom && dinoRect.bottom > lionRect.top) {
                lion.style.display = 'none'; // Hide lion on collision
                selectedSum= handleLionSelection(lion); // Update the lion selection count
                console.log("selectedSum",selectedSum)

                showCollisionAnimation(lionRect.left, lionRect.top); // Show collision animation
                playHitSound();
                if (selectedSum > window.quizAnswer+ 10 ) {
                    debugger;
                    resetLevelWithMessage("Exceeded the quiz answer. Restarting level.");
                   
                }
       
               
            //     if (selectedSum ===  window.quizAnswer)
            //    {

            //     console.log("level complete");
            //     checkLevelComplete();
            //     startNextLevel(window.quizAnswer);

            //    }
            }
        }
    });
    // Check collision with boost icon
    if (boostIcon.style.display !== 'none') {
        const boostRect = boostIcon.getBoundingClientRect();
        if (dinoRect.left < boostRect.right && dinoRect.right > boostRect.left &&
            dinoRect.top < boostRect.bottom && dinoRect.bottom > boostRect.top) {
            activateBoost();
            boostIcon.style.display = 'none'; // Hide boost icon on collision
            showCollisionAnimation(boostRect.left, boostRect.top); // Show collision animation
            clearTimeout(boostTimeout); // Clear timeout to prevent automatic activation
        }
    }
}
function showCollisionAnimation(x, y) {
    console.log("collision animation")
    const collisionAnimation = document.createElement('img');
    collisionAnimation.src = 'images/explosion.gif'; // Update with the correct path
    collisionAnimation.style.position = 'absolute';
    collisionAnimation.style.left = x + 'px';
    collisionAnimation.style.top = y + 'px';
    collisionAnimation.style.width = '100px'; // Adjust size as needed
    collisionAnimation.style.height = '100px';
    document.body.appendChild(collisionAnimation);

    setTimeout(() => {
        collisionAnimation.remove();
    }, 2000); // Remove the animation after 1 second
}
 


// Function to play the hit sound
function playHitSound() {
    hitSound.play();
    setTimeout(() => {
        hitSound.pause();
        hitSound.currentTime = 0; // Resets the audio to the beginning
    }, 2000); // Play for 2 seconds
}


function handleMathQuizCompletion() {
    const selectedSum = calculateSelectedLionSum();
    const quizAnswer = window.quizAnswer;

    if (selectedSum === quizAnswer) {
        // Correct answer
        document.getElementById('mathQuizModal').style.display = 'none'; // Close the quiz modal

        // Proceed with the game...
        startNextLevel(quizAnswer);
    } else {
        // Incorrect answer
        alert("Incorrect answer. Please try again!");
        // Optionally reset the quiz or the level here
    }
}

export function startNextLevel(quizAnswer) {
   // const answer = showMathQuiz(); // Show math quiz and get answer
    window.quizAnswer = quizAnswer;
    document.getElementById('score').innerText = `${score}`;
   // document.getElementById('selectedLionCount').innerText = ``;
 
    level++;
    updateLevelDisplay(level);

    // Remove old lions
    lions.forEach(lion => lion.remove());

    // Show level complete modal with message
    const modalContent = document.getElementById('levelCompleteModal').querySelector('.modal-content');
    let modalMessage = `<h2 class="modal-message">Level ${level} Complete! Press Enter to continue...</h2>`;
    if (quizAnswer !== undefined) {
        modalMessage += `<p class="modal-message">Correct! The answer is ${quizAnswer}.</p>`;
    }
    modalContent.innerHTML = modalMessage;
    document.getElementById('levelCompleteModal').style.display = 'block';

    // Apply jumping effect to the dinosaur
    document.getElementById('dinosaur').classList.add('jumping');
 
    document.addEventListener('mathQuizCompleted', handleMathQuizCompletion);
}

export function restartLevel(quizAnswer) {
    // const answer = showMathQuiz(); // Show math quiz and get answer
     window.quizAnswer = quizAnswer;
     document.getElementById('score').innerText = `${score}`;
    // document.getElementById('selectedLionCount').innerText = ``;
 
     // Remove old lions
     lions.forEach(lion => lion.remove());
 
     // Show level complete modal with message
  document.getElementById('selectedLionCount').innerText = ``;

  
     document.addEventListener('mathQuizCompleted', handleMathQuizCompletion);
 }
 

function updateLevelDisplay(level) {
    const levelDisplay = document.getElementById('currentLevel');
    if (levelDisplay) {
        levelDisplay.textContent = level;
    }
}
 
// Function to fetch character configuration
async function fetchCharacterConfig() {
    try {
        const response = await fetch('characters.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching character configuration:', error);
        return {};
    }
}