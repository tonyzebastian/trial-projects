const fishes = document.querySelectorAll('.fish');
let fishData = Array.from(fishes).map((fish) => ({
    element: fish,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: 0,
    vy: 0,
    cursorFollowSpeed: 0.001 + Math.random() * 0.002, // Much slower response
    personalSpace: 70 + Math.random() * 30, // Increased spacing
}));

let cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let lastCursor = { x: cursor.x, y: cursor.y };
let cursorSpeed = 0;
let idleTimer = 0;  // Timer for idle state

document.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    idleTimer = 0;  // Reset idle timer on movement
});

function updateFishes() {
    // Calculate cursor speed
    cursorSpeed = Math.hypot(cursor.x - lastCursor.x, cursor.y - lastCursor.y);
    lastCursor.x = cursor.x;
    lastCursor.y = cursor.y;

    let cursorInfluence = cursorSpeed > 1 ? 0.002 : 0.0005; // Very slow movement when idle

    fishData.forEach((fish) => {
        let avoidX = 0, avoidY = 0;

        // Apply separation to avoid clustering too tightly
        fishData.forEach((otherFish) => {
            if (fish !== otherFish) {
                let distance = Math.hypot(fish.x - otherFish.x, fish.y - otherFish.y);
                if (distance < fish.personalSpace) {
                    avoidX += fish.x - otherFish.x;
                    avoidY += fish.y - otherFish.y;
                }
            }
            
            // Only rotate if there's significant movement
            let speed = Math.hypot(fish.vx, fish.vy);
            if (speed > 0.1) { // Minimum speed threshold for rotation
                let angle = Math.atan2(fish.vy, fish.vx) * (180 / Math.PI);
                // Store current angle if not already present
                if (!fish.currentAngle) fish.currentAngle = angle;
                // Smooth angle interpolation
                fish.currentAngle = fish.currentAngle + (angle - fish.currentAngle) * 0.1;
                fish.element.style.transform = `rotate(${fish.currentAngle}deg)`;
            }
        });

        fish.vx += avoidX * 0.02; // Reduced repulsion force
        fish.vy += avoidY * 0.02;

        // Slow down the fish when the cursor is idle
        if (cursorSpeed < 1) {
            fish.vx += (cursor.x - fish.x) * fish.cursorFollowSpeed * 0.1;  // Less influence when idle
            fish.vy += (cursor.y - fish.y) * fish.cursorFollowSpeed * 0.1;
        } else {
            // Fast following when moving quickly
            fish.vx += (cursor.x - fish.x) * fish.cursorFollowSpeed;
            fish.vy += (cursor.y - fish.y) * fish.cursorFollowSpeed;
        }

        // Reduce overall movement blur (by minimizing velocity changes)
        let maxSpeed = cursorSpeed > 1 ? 1.5 : 0.3; // Even slower when idle
        let speed = Math.hypot(fish.vx, fish.vy);
        if (speed > maxSpeed) {
            fish.vx *= 0.9;
            fish.vy *= 0.9;
        }

        fish.x += fish.vx;
        fish.y += fish.vy;

        fish.element.style.left = `${fish.x}px`;
        fish.element.style.top = `${fish.y}px`;

        // Gradual rotation of fish, slower when idle
        let angle = Math.atan2(fish.vy, fish.vx) * (180 / Math.PI);
        fish.element.style.transform = `rotate(${angle}deg)`;
    });

    // Gradually slow down the fish when idle for a period of time
    if (cursorSpeed < 1) {
        idleTimer++;
        if (idleTimer > 200) {  // Idle for more than 200 frames
            fishData.forEach((fish) => {
                fish.vx *= 0.9;  // Slowly reduce velocity to simulate idle motion
                fish.vy *= 0.9;
            });
        }
    }

    requestAnimationFrame(updateFishes);
}

updateFishes();