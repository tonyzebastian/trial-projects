const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mouse position
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

// Create and load fish image
const fishImage = new Image();
fishImage.src = 'fish.png'; // Make sure to add your fish image to the project directory

// Fish class
class Fish {
    constructor(index) {
        this.size = Math.random() * 20 + 30; // Random size between 30 and 50
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 2 + 1;
        this.angle = 0;
        this.facingRight = true;
        this.image = fishImage;
        // Add offset angle for circular formation
        this.offsetAngle = (Math.PI * 2 * index) / numFish;
        // Add random variation to movement
        this.randomOffset = {
            x: 0,
            y: 0
        };
    }

    update() {
        // Update random offset periodically
        if (Math.random() < 0.02) {
            this.randomOffset = {
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40
            };
        }

        // Calculate desired position in circular formation around cursor
        const formationRadius = 30; // Reduced radius to keep fish closer to cursor
        const desiredX = mouse.x + Math.cos(this.offsetAngle) * formationRadius + this.randomOffset.x;
        const desiredY = mouse.y + Math.sin(this.offsetAngle) * formationRadius + this.randomOffset.y;

        // Calculate direction to desired position
        const dx = desiredX - this.x;
        const dy = desiredY - this.y;
        this.angle = Math.atan2(dy, dx);

        // Update facing direction
        this.facingRight = dx > 0;

        // Move towards desired position
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Apply collision avoidance
        this.avoidCollisions();

        // Keep fish within canvas bounds
        this.x = Math.max(this.size/2, Math.min(canvas.width - this.size/2, this.x));
        this.y = Math.max(this.size/2, Math.min(canvas.height - this.size/2, this.y));
    }

    avoidCollisions() {
        fishes.forEach(otherFish => {
            if (otherFish === this) return;

            const dx = this.x - otherFish.x;
            const dy = this.y - otherFish.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (this.size + otherFish.size) * 1; // Minimum distance between fish

            if (distance < minDistance) {
                // Calculate separation force
                const angle = Math.atan2(dy, dx);
                const separationForce = (minDistance - distance) * 0.05;

                // Apply separation force
                this.x += Math.cos(angle) * separationForce;
                this.y += Math.sin(angle) * separationForce;
            }
        });
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Scale horizontally based on direction
        ctx.scale(this.facingRight ? 1 : -1, 1);
        
        // Draw the fish image
        ctx.drawImage(
            fishImage,
            -this.size / 2, // Center the image
            -this.size / 2,
            this.size,
            this.size
        );
        
        ctx.restore();
    }
}

// Create fish school with index
const numFish = 30;
const fishes = Array.from({ length: numFish }, (_, index) => new Fish(index));

// Add smooth cursor movement
let smoothMouse = { x: canvas.width / 2, y: canvas.height / 2 };
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Animation loop with smooth cursor movement
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smooth cursor movement
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.1;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.1;
    
    // Update mouse reference for fish to use smooth position
    mouse.x = smoothMouse.x;
    mouse.y = smoothMouse.y;
    
    fishes.forEach(fish => {
        fish.update();
        fish.draw();
    });
    
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start animation once the image is loaded
fishImage.onload = () => {
    animate();
};