const gameArea = document.getElementById('game');
export let lions = []; // Export lions array
import { updateGameScore } from './gameUtils.js'; // Assuming you have a function to update the score

import {  calculateSelectedLionSum  } from './math.js';

// Random movement for lions
export function moveLions() {
    lions.forEach(lion => {
        lion.style.left = Math.random() * (window.innerWidth - lion.offsetWidth) + 'px';
        lion.style.top = Math.random() * (window.innerHeight - lion.offsetHeight) + 'px';
    });
}

// Function to handle lion selection
export function handleLionSelection(lion) {
    console.log("Lion selected/deselected:", lion);
    lion.classList.toggle('selected');
    let selectedSum= updateSelectedLionCount();
    return selectedSum;
}


function updateSelectedLionCount() {
    const selectedSum = calculateSelectedLionSum();
    document.getElementById('selectedLionCount').textContent = selectedSum;
    updateGameScore(selectedSum); // Update the score using the callback
    return selectedSum;
}
// Function to create lions
// Function to create lions
export function createLions(number, lionImageUrl, isQuizMode = false, quizAnswer = 0) {
    console.log(`Creating lions: Number - ${number}, IsQuizMode - ${isQuizMode}, QuizAnswer - ${quizAnswer}`);

    // Clear existing lions first
    lions.forEach(lion => lion.remove());
    lions.length = 0;

    if (isQuizMode) {
        // Create lions based on the math quiz answer
        let totalLions = quizAnswer + Math.floor(Math.random() * 3) + 2; 
        while (totalLions > 0) {
            let groupSize = Math.min(totalLions, Math.floor(Math.random() * 6) + 1);
            groupSize = Math.min(groupSize, Math.ceil(quizAnswer / 2));

            for (let i = 0; i < groupSize; i++) {
                let lion = document.createElement('div');
                lion.className = 'lion';
                lion.style.backgroundImage = `url('${lionImageUrl}')`;
                lion.style.backgroundSize = 'cover';
                lion.setAttribute('data-value', '1');
                console.log('Creating lion with data-value:', lion.getAttribute('data-value')); // Debugging log
                gameArea.appendChild(lion);
                lions.push(lion);
            }
            totalLions -= groupSize;
        }
    } else {
        // Standard game mode lion creation
        for (let i = 0; i < number; i++) {
            let lion = document.createElement('div');
            lion.className = 'lion';
            lion.style.backgroundImage = `url('${lionImageUrl}')`;
            lion.style.backgroundSize = 'cover';
            lion.setAttribute('data-value', '1');
            console.log('Creating lion with data-value:', lion.getAttribute('data-value')); // Debugging log
            gameArea.appendChild(lion);
            lions.push(lion);
        }
    }
}




function checkLionSelection() {
    let selectedSum = 0;
    document.querySelectorAll('.lion.selected').forEach(lion => {
        selectedSum += parseInt(lion.dataset.value, 10);
    });

    if (selectedSum === window.quizAnswer) {
        // Correct sum, proceed to the next part of the game
        alert("Correct! Proceeding to the next level.");
        // Logic to proceed to the next level
    } else {
        // Incorrect sum, handle as needed
        alert("Incorrect selection. Please try again.");
        // Logic to restart the quiz or handle incorrect selection
    }
}


// Optionally export the lions array if it's needed in other modules
