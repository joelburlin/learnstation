const gameArea = document.getElementById('game');
export let lions = []; // Export lions array


// Random movement for lions
export function moveLions() {
    lions.forEach(lion => {
        lion.style.left = Math.random() * (window.innerWidth - lion.offsetWidth) + 'px';
        lion.style.top = Math.random() * (window.innerHeight - lion.offsetHeight) + 'px';
    });
}

// Function to create lions
// Function to create lions

// Function to create lions
export function createLions(number, lionImageUrl) {
    // Clear existing lions first
    lions.forEach(lion => lion.remove());
    lions.length = 0;

    for (let i = 0; i < number; i++) {
        let lion = document.createElement('div');
        lion.className = 'lion';
        if (lionImageUrl) {
            lion.style.backgroundImage = `url('${lionImageUrl}')`;
            lion.style.backgroundSize = 'cover';
        }
        gameArea.appendChild(lion);
        lions.push(lion);
    }
}
// Optionally export the lions array if it's needed in other modules
