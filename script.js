// Importing modules
import { startNextLevel, checkCollision, startGame,createBoostIcon, showBoostIcon ,resetLevelWithMessage,startLevelWithMathQuiz,playCorrectSound,playWrongSound,level,boostActive} from './gameUtils.js';
import { moveLions} from './lions.js';
import { closeMathQuiz,calculateSelectedLionSum} from './math.js';
const gameArea = document.getElementById('game');
const movingSound = document.getElementById('movingSound');

function startNewGame() {
    // Logic to start a new game
    // Hide any modals, reset game state, scores, etc.
    document.getElementById('levelCompleteModal').style.display = 'none';
    document.getElementById('levelNotCompleteModal').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'flex';
    document.getElementById('game').style.display = 'none';
    document.querySelectorAll('.lion').forEach(lion => lion.classList.remove('selected'));
    document.getElementById('score').innerText = "Score: 0";
    document.getElementById('selectedLionCount').innerText = "0";
    document.getElementById('currentLevel').innerText = "1";

    
    // Reset any other game state as neededcurrentLevel
}
 

let isMoving = false;
const dinosaur = document.getElementById('dinosaur');

// Function to show feedback in a modal
function showFeedbackModal(message, modalId) {
    const modalContent = document.getElementById(modalId).querySelector('.modal-content');
    modalContent.innerHTML = `<h2 class="modal-message">${message}</h2>`;
    document.getElementById(modalId).style.display = 'block';

    // Apply jumping effect to the dinosaur
    document.getElementById('dinosaur').classList.add('jumping');

    // Listen for Enter key to close the modal

}

// Keyboard controls for the dinosaur and level completion logic
document.addEventListener('keydown', (e) => {
    // If the level complete modal is displayed and Enter key is pressed
    if (e.key === 'Enter') {
        console.log('enter key pressed');
        const selectedSum = calculateSelectedLionSum();
        if (selectedSum > window.quizAnswer) {
            // Too many lions selected, restart level
            resetLevelWithMessage("Exceeded the quiz answer. Restarting level.");
            playWrongSound();
        } else if (selectedSum === window.quizAnswer  && (document.getElementById('levelCompleteModal').style.display === 'none' || document.getElementById('levelCompleteModal').style.display === '')) {
            // Correct number of lions selected, proceed to next level
            document.getElementById('levelCompleteModal').style.display = 'none';

            document.getElementById('dinosaur').classList.remove('jumping');
            startNextLevel(window.quizAnswer);
        } else if (document.getElementById('levelCompleteModal').style.display === 'block') {

            startLevelWithMathQuiz(level);
            // Correct number of lions selected, proceed to next level
            document.getElementById('levelCompleteModal').style.display = 'none';

            document.getElementById('dinosaur').classList.remove('jumping');
     
        } else if (document.getElementById('levelNotCompleteModal').style.display === 'block') {
 

            // Correct number of lions selected, proceed to next level
            document.getElementById('levelNotCompleteModal').style.display = 'none';
 
     
        }    else if (selectedSum < window.quizAnswer ){
            // Not enough lions selected, provide feedback
            showFeedbackModal("Keep going! You haven't reached the target number yet.","levelNotCompleteModal");
            playWrongSound();
        }
        return; // Prevent other key actions
    }
 
    // Handle dinosaur movement
    const speed = boostActive ? 400 : 100; // Adjust speed if boost is active
    if (boostActive) {

        console.log('boost active')
    }
    const rect = dinosaur.getBoundingClientRect();
    let moved = false;
    let newLeft = rect.left;
    let newTop = rect.top;

    // Movement keys logic
    switch (e.key) {
        case 'ArrowLeft':
            newLeft = Math.max(0, rect.left - speed);
            dinosaur.style.transform = 'scaleX(-1)'; // Flip image when moving left
            moved = true;
            break;
        case 'ArrowRight':
            newLeft = Math.min(window.innerWidth - dinosaur.offsetWidth, rect.left + speed);
            dinosaur.style.transform = 'scaleX(1)'; // Flip image back to normal when moving right
            moved = true;
            break;
        case 'ArrowUp':
            newTop = Math.max(0, rect.top - speed);
            moved = true;
            break;
        case 'ArrowDown':
            newTop = Math.min(window.innerHeight - dinosaur.offsetHeight, rect.top + speed);
            moved = true;
            break;
    }

    // Apply movement and check collision
    if (moved) {
        dinosaur.style.left = newLeft + 'px';
        dinosaur.style.top = newTop + 'px';
        if (!isMoving) {
            movingSound.play();
            isMoving = true;
        }
        checkCollision();
    }
});

// Stop moving sound when no key is pressed
document.addEventListener('keyup', () => {
    movingSound.pause();
    movingSound.currentTime = 0;
    isMoving = false;
});

 

   // Event listener for the Escape key to start a new game
   document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        startNewGame(); // Function to start a new game
    }
});


 
// // Keyboard controls for the dinosaur
// document.addEventListener('keydown', (e) => {
    
//     if (e.key === 'Enter' && document.getElementById('levelCompleteModal').style.display === 'block') {
//         document.getElementById('levelCompleteModal').style.display = 'none';
//         startNextLevel();
//     }

//     const speed = boostActive ? 200 : 100; // 10 times faster when boost is active
//     const rect = dinosaur.getBoundingClientRect();
//     let moved = false;
//     let newLeft = rect.left;
//     let newTop = rect.top;

//     switch (e.key) {
//         case 'ArrowLeft':
//             newLeft = Math.max(0, rect.left - speed);
//             dinosaur.style.transform = 'scaleX(-1)'; // Flip image when moving left
//             moved = true;
//             break;
//         case 'ArrowRight':
//             newLeft = Math.min(window.innerWidth - dinosaur.offsetWidth, rect.left + speed);
//             dinosaur.style.transform = 'scaleX(1)'; // Flip image back to normal when moving right
//             moved = true;
//             break;
//         case 'ArrowUp':
//             newTop = Math.max(0, rect.top - speed);
//             moved = true;
//             break;
//         case 'ArrowDown':
//             newTop = Math.min(window.innerHeight - dinosaur.offsetHeight, rect.top + speed);
//             moved = true;
//             break;
//     }

//     dinosaur.style.left = newLeft + 'px';
//     dinosaur.style.top = newTop + 'px';

//     if (moved) {
//         if (!isMoving) {
//             movingSound.play();
//             isMoving = true;
//         }
//         checkCollision();
//     }
// });

// Stop moving sound when no key is pressed
document.addEventListener('keyup', () => {
    movingSound.pause();
    movingSound.currentTime = 0;
    isMoving = false;
});

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const characters = document.querySelectorAll('.character');
    const nameInput = document.getElementById('nameInput');

    characters.forEach(character => {
        character.addEventListener('click', () => {
            const characterName = character.getAttribute('data-name');
            nameInput.value = characterName;
            startGame(characterName); // Function to start the game
        });
    });

    // Add click event listener to the quiz modal button, if it exists
    const quizOkButton = document.getElementById('mathQuizModal')?.querySelector('button');
    if (quizOkButton) {
        quizOkButton.addEventListener('click', closeMathQuiz);
    } else {
        console.error('Quiz OK button not found');
    }

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault(); // Prevent default tab behavior
            startGame(nameInput.value);
        }
    });

       // Adding a new game button in the top left
       const newGameBtn = document.createElement('button');
       newGameBtn.textContent = 'New Game';
       newGameBtn.style.position = 'absolute';
       newGameBtn.style.right = '0px';
       newGameBtn.style.bottom = '0px';
       document.body.appendChild(newGameBtn);
   
       newGameBtn.addEventListener('click', startNewGame)
   
});


// Initialize game
// Initialize game
window.onload = () => {
    createBoostIcon();
    setInterval(showBoostIcon, 10000);

    moveLions();
    setInterval(moveLions, 3000);


    // Initially, hide the game area and score
    document.getElementById('game').style.display = 'none';
    document.getElementById('score').style.display = 'none';
};


 