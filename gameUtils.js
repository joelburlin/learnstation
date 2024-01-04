
import { lions, createLions, moveLions } from './lions.js';

let currentCharacterConfig = null;

let numberOfLions=8;
const gameArea = document.getElementById('game');
 
 
let boostActive = false;
const hitSound = document.getElementById('hitSound');
let score = 0;
let lastBoostIconTime = Date.now(); // Keep track of last time the boost icon was shown
let boostTimeout;
let level =1;
let boostIcon;


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
    } else {
        console.error('Character configuration not found for:', characterName);
    }
}
function applyCharacterSettings() {
    if (currentCharacterConfig) {
        const settings = currentCharacterConfig;
        dinosaur.style.backgroundImage = `url('${settings.image}')`;
        gameArea.style.backgroundImage = `url('${settings.backgroundImage}')`;
        movingSound.src = settings.movingSound;

        lions.forEach(lion => lion.remove()); // Clear existing lions

        createLions(numberOfLions, settings.lionImage); // Use global config for lion image
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
        boostTimeout = setTimeout(function() {
            boostIcon.style.display = 'none';
            activateBoost();
        }, duration);
    }
}
export function activateBoost() {
    boostActive = true;
    debugger;

    // Set a timeout to deactivate the boost after 10 seconds
    setTimeout(function() {
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
    boostIcon.addEventListener('click', function() {
        clearTimeout(boostTimeout);
        boostIcon.style.display = 'none';
    });
}

// Function to check collision with lions
export function checkCollision() {
    const dinoRect = dinosaur.getBoundingClientRect();
    
    // Check collision with lions
    lions.forEach((lion, index) => {
        if (lion.style.display !== 'none') {
            const lionRect = lion.getBoundingClientRect();
            if (dinoRect.left < lionRect.right && dinoRect.right > lionRect.left &&
                dinoRect.top < lionRect.bottom && dinoRect.bottom > lionRect.top) {
                    lion.style.display = 'none'; // Hide lion on collision
                    showCollisionAnimation(lionRect.left, lionRect.top); // Show collision animation
                    score++;
                    document.getElementById('score').innerText = `Score: ${score}`;
                    playHitSound();
                    checkLevelComplete();
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

 // Check if level is complete
 function checkLevelComplete() {
    if (lions.every(lion => lion.style.display === 'none')) {
        document.getElementById('levelCompleteModal').style.display = 'block';
        level++;
    }
}



// Function to play the hit sound
 function playHitSound() {
    hitSound.play();
    setTimeout(() => {
        hitSound.pause();
        hitSound.currentTime = 0; // Resets the audio to the beginning
    }, 2000); // Play for 2 seconds
}


// Start next level
export function startNextLevel() {
    level++;
    numberOfLions = Math.ceil(numberOfLions * 1.25); // Increase the number of lions

    // Remove old lions
    lions.forEach(lion => lion.remove());

    // Create new lions for the next level with the current character's lion image
    const lionImage = currentCharacterConfig ? currentCharacterConfig.lionImage : null;
    createLions(numberOfLions, lionImage);

    // Update level display, if you have one
    updateLevelDisplay(level);


    // Reset other necessary game state as needed
    // ...
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