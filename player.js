console.log("Android 17: reporting for duty SGT!");

window.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    // Configuration
    let currentX = 20; 
    const PLAYER_WIDTH = 50;
    const GAME_WIDTH = 810;
    
    // Tweak this number to change how fast the character slides!
    const MOVEMENT_SPEED = 10; 

    // Track state: Is a movement button currently being pressed down?
    let isMovingLeft = false;
    let isMovingRight = false;

    // --- MAIN GAME LOOP ENGINE ---
    // This function updates the positions on every screen frame redraw
    
	function updateGameFrame() {
    // Definimos el límite máximo derecho dinámicamente
    const maxRightMargin = GAME_WIDTH - PLAYER_WIDTH;

    // Usamos 'else if' para que un movimiento bloquee el otro y no se crucen las coordenadas
    if (isMovingLeft) {
        currentX -= MOVEMENT_SPEED;
        // Si se pasa del borde izquierdo, lo frena en 0
        if (currentX < 0) {
            currentX = 0;
        }
    } else if (isMovingRight) {
        currentX += MOVEMENT_SPEED;
        // Si se pasa del borde derecho, lo frena en el límite máximo
        if (currentX > maxRightMargin) {
            currentX = maxRightMargin;
        }
    }

    // ACTUALIZACIÓN VISUAL ÚNICA: Se ejecuta una sola vez por fotograma
    player.style.left = currentX + 'px';

    // Mantiene el bucle del juego corriendo de forma fluida
    requestAnimationFrame(updateGameFrame);
}

    
    // Kickstart the game loop engine immediately
    requestAnimationFrame(updateGameFrame);


    // --- HOOKING UP SCREEN BUTTONS (Continuous Hold) ---

    // Left Button Events
    btnLeft.addEventListener('mousedown', () => isMovingLeft = true);
    btnLeft.addEventListener('mouseup', () => isMovingLeft = false);
    btnLeft.addEventListener('mouseleave', () => isMovingLeft = false); // Stops movement if mouse slides off button
    
    // Mobile Touch Events for Left Button
    btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); isMovingLeft = true; });
    btnLeft.addEventListener('touchend', () => isMovingLeft = false);

    // Right Button Events
    btnRight.addEventListener('mousedown', () => isMovingRight = true);
    btnRight.addEventListener('mouseup', () => isMovingRight = false);
    btnRight.addEventListener('mouseleave', () => isMovingRight = false);
    
    // Mobile Touch Events for Right Button
    btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); isMovingRight = true; });
    btnRight.addEventListener('touchend', () => isMovingRight = false);


    // --- HOOKING UP KEYBOARD (Continuous Hold) ---
    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') isMovingLeft = true;
        if (event.key === 'ArrowRight') isMovingRight = true;
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft') isMovingLeft = false;
        if (event.key === 'ArrowRight') isMovingRight = false;
    });
});
