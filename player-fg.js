console.log("Android 17: reporting for duty SGT!");

// 1. Get elements
const player = document.getElementById('player');
const buttons = {
    left: document.getElementById('left'),
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    right: document.getElementById('right')
};

// 2. Exact requested starting positions
let posX = 0;
let posY = 480; 

// 3. Define explicit scene boundaries
const MIN_X = 0;
const MIN_Y = 0;   // Absolute top edge
const MAX_X = 1780; // Right wall limit
const MAX_Y = 480;  // Bottom wall limit

// 4. Movement configuration
const speed = 8; 
let animationFrameId = null;

// Track active directional states simultaneously for keyboard + touch combinations
const activeInputs = {
    left: false,
    right: false,
    up: false,
    down: false
};

// Map keyboard keys to our directional inputs
const keyMap = {
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'a': 'left', // Optional WASD support included
    'd': 'right',
    'w': 'up',
    's': 'down'
};

// 5. Core game loop with hard, independent axis limits
function gameLoop() {
    let nextX = posX;
    let nextY = posY;

    // Calculate potential next steps based on all active inputs
    if (activeInputs.left) nextX -= speed;
    if (activeInputs.right) nextX += speed;
    if (activeInputs.up) nextY -= speed;
    if (activeInputs.down) nextY += speed;

    // Independent X Boundary Lock & Snap
    if (nextX >= MIN_X && nextX <= MAX_X) {
        posX = nextX;
    } else if (nextX < MIN_X) {
        posX = MIN_X; 
    } else if (nextX > MAX_X) {
        posX = MAX_X;
    }
    
    // Independent Y Boundary Lock & Snap (Allows hitting absolute MIN_Y / 0)
    if (nextY >= MIN_Y && nextY <= MAX_Y) {
        posY = nextY;
    } else if (nextY < MIN_Y) {
        posY = MIN_Y; // Hard snap to absolute top ceiling
    } else if (nextY > MAX_Y) {
        posY = MAX_Y;
    }

    // Apply clean pixel coordinates
    player.style.left = `${posX}px`;
    player.style.top = `${posY}px`;

    // Keep loop running if any input is still held down
    if (activeInputs.left || activeInputs.right || activeInputs.up || activeInputs.down) {
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        animationFrameId = null; // Sleep engine safely
    }
}

// 6. Centralized input state managers
function handleInputStart(direction) {
    if (!direction) return;
    activeInputs[direction] = true;
    
    // Wake up loop if it is asleep
    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function handleInputEnd(direction) {
    if (!direction) return;
    activeInputs[direction] = false;
}

// 7. Attach Keyboard Listeners (Fixes the missing link)
window.addEventListener('keydown', (e) => {
    if (keyMap[e.key]) {
        // Prevent page scrolling when pressing arrow keys
        if (e.key.startsWith('Arrow')) e.preventDefault(); 
        handleInputStart(keyMap[e.key]);
    }
});

window.addEventListener('keyup', (e) => {
    if (keyMap[e.key]) {
        handleInputEnd(keyMap[e.key]);
    }
});

// 8. Attach On-Screen Button Listeners
Object.keys(buttons).forEach(id => {
    const btn = buttons[id];
    if (!btn) return; // Guard clause in case a button element is missing from HTML
    
    // Mouse Events
    btn.addEventListener('mousedown', () => handleInputStart(id));
    btn.addEventListener('mouseup', () => handleInputEnd(id));
    btn.addEventListener('mouseleave', () => handleInputEnd(id));

    // Touch Events
    btn.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        handleInputStart(id);
    }, { passive: false });
    
    btn.addEventListener('touchend', (e) => {
        if (e.cancelable) e.preventDefault();
        handleInputEnd(id);
    }, { passive: false });
});

// 9. Force initial layout position
player.style.position = 'absolute';
player.style.left = `${posX}px`;
player.style.top = `${posY}px`;
