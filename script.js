// Importing modules
import { startNextLevel, checkCollision, startGame,createBoostIcon, showBoostIcon } from './gameUtils.js';
import { moveLions} from './lions.js';

const gameArea = document.getElementById('game');
const movingSound = document.getElementById('movingSound');


let boostActive = false;

let isMoving = false;
const dinosaur = document.getElementById('dinosaur');











 
// Keyboard controls for the dinosaur
document.addEventListener('keydown', (e) => {
    
    if (e.key === 'Enter' && document.getElementById('levelCompleteModal').style.display === 'block') {
        document.getElementById('levelCompleteModal').style.display = 'none';
        startNextLevel();
    }

    const speed = boostActive ? 200 : 100; // 10 times faster when boost is active
    const rect = dinosaur.getBoundingClientRect();
    let moved = false;
    let newLeft = rect.left;
    let newTop = rect.top;

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

    dinosaur.style.left = newLeft + 'px';
    dinosaur.style.top = newTop + 'px';

    if (moved) {
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

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault(); // Prevent default tab behavior
            startGame(nameInput.value);
        }
    });

   
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


 