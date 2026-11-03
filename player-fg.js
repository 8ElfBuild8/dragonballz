console.log("Android 17");


 // 1. Get elements
const player = document.getElementById('player');

const buttons = {
    left: document.getElementById('left'),
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    right: document.getElementById('right')
};

// 2. Exact starting positions
let posX = 0;
let posY = 480;

// 3. Scene boundaries
const MIN_X = 0;
const MIN_Y = 0;
const MAX_X = 1780;
const MAX_Y = 480;

// 4. Movement configuration
const speed = 8;
let animationFrameId = null;

// NEW: Android 17 animations
const animaciones = {
    idle: 'android_17_idle.webp',
    right: 'android_17_front_walk.webp',
    left: 'android_17_front_walk.webp',
    up: 'android_17_walk_up.webp',
    down: 'android_17_walk_down.webp'
};

let animacionActual = 'idle';
let ultimaDireccion = 'right';

// NEW: Change character animation
function cambiarAnimacion(nombre) {

    if (animacionActual !== nombre) {
        animacionActual = nombre;
        player.src = animaciones[nombre];
    }

    // Flip character when walking left
    if (nombre === 'left' ||
        (nombre === 'idle' && ultimaDireccion === 'left')) {

        player.style.transform = 'scaleX(-1)';

    } else {

        player.style.transform = 'scaleX(1)';

    }
}

// Track active directional states
const activeInputs = {
    left: false,
    right: false,
    up: false,
    down: false
};

// Keyboard controls
const keyMap = {
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'a': 'left',
    'd': 'right',
    'w': 'up',
    's': 'down'
};

// 5. Core game loop
function gameLoop() {

    let nextX = posX;
    let nextY = posY;

    if (activeInputs.left) nextX -= speed;
    if (activeInputs.right) nextX += speed;
    if (activeInputs.up) nextY -= speed;
    if (activeInputs.down) nextY += speed;

    // X boundaries
    if (nextX >= MIN_X && nextX <= MAX_X) {
        posX = nextX;
    } else if (nextX < MIN_X) {
        posX = MIN_X;
    } else if (nextX > MAX_X) {
        posX = MAX_X;
    }

    // Y boundaries
    if (nextY >= MIN_Y && nextY <= MAX_Y) {
        posY = nextY;
    } else if (nextY < MIN_Y) {
        posY = MIN_Y;
    } else if (nextY > MAX_Y) {
        posY = MAX_Y;
    }

    // Apply movement
    player.style.left = `${posX}px`;
    player.style.top = `${posY}px`;

    // NEW: Select animation
    if (activeInputs.left) {
        ultimaDireccion = 'left';
        cambiarAnimacion('left');

    } else if (activeInputs.right) {
        ultimaDireccion = 'right';
        cambiarAnimacion('right');

    } else if (activeInputs.up) {
        ultimaDireccion = 'up';
        cambiarAnimacion('up');

    } else if (activeInputs.down) {
        ultimaDireccion = 'down';
        cambiarAnimacion('down');

    } else {
        cambiarAnimacion('idle');
    }

    // Continue movement
    if (
        activeInputs.left ||
        activeInputs.right ||
        activeInputs.up ||
        activeInputs.down
    ) {

        animationFrameId = requestAnimationFrame(gameLoop);

    } else {

        animationFrameId = null;

    }
}

// 6. Input managers
function handleInputStart(direction) {

    if (!direction) return;

    activeInputs[direction] = true;

    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function handleInputEnd(direction) {

    if (!direction) return;

    activeInputs[direction] = false;

    // NEW: Return to idle immediately
    if (
        !activeInputs.left &&
        !activeInputs.right &&
        !activeInputs.up &&
        !activeInputs.down
    ) {
        cambiarAnimacion('idle');
    }
}

// 7. Keyboard listeners
window.addEventListener('keydown', (e) => {

    const direction = keyMap[e.key];

    if (direction) {

        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
        }

        handleInputStart(direction);
    }
});

window.addEventListener('keyup', (e) => {

    const direction = keyMap[e.key];

    if (direction) {
        handleInputEnd(direction);
    }
});

// 8. On-screen buttons
Object.keys(buttons).forEach(id => {

    const btn = buttons[id];

    if (!btn) return;

    // Mouse
    btn.addEventListener('mousedown', () => {
        handleInputStart(id);
    });

    btn.addEventListener('mouseup', () => {
        handleInputEnd(id);
    });

    btn.addEventListener('mouseleave', () => {
        handleInputEnd(id);
    });

    // Touch
    btn.addEventListener('touchstart', (e) => {

        if (e.cancelable) e.preventDefault();

        handleInputStart(id);

    }, { passive: false });

    btn.addEventListener('touchend', (e) => {

        if (e.cancelable) e.preventDefault();

        handleInputEnd(id);

    }, { passive: false });

    btn.addEventListener('touchcancel', () => {
        handleInputEnd(id);
    });
});

// Stop movement if window loses focus
window.addEventListener('blur', () => {

    Object.keys(activeInputs).forEach(direction => {
        activeInputs[direction] = false;
    });

    cambiarAnimacion('idle');
});

// 9. Initial position
player.style.position = 'absolute';
player.style.left = `${posX}px`;
player.style.top = `${posY}px`;

// NEW: Initial idle animation
cambiarAnimacion('idle');
