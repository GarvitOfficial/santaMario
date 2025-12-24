export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
    }

    addParticle(p) {
        this.particles.push(p);
    }

    createSnow() {
        // Fill screen with snow initially
        for (let i = 0; i < 100; i++) {
            this.addParticle(new SnowParticle(
                Math.random() * this.game.width,
                Math.random() * this.game.height
            ));
        }
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 30; i++) {
            this.addParticle(new FireworkParticle(x, y, color));
        }
    }

    update(deltaTime) {
        // Spawn new snow
        if (Math.random() < 0.2) {
            this.addParticle(new SnowParticle(
                Math.random() * this.game.width,
                -10
            ));
        }

        this.particles.forEach(p => p.update(deltaTime));
        this.particles = this.particles.filter(p => !p.markedForDeletion);
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}

class SnowParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Wind effect slightly
        this.x += Math.sin(this.y * 0.01) * 0.5;

        if (this.y > 1000) { // arbitrary overly large height to ensure off screen
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color || `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.life = 100;
        this.decay = Math.random() * 0.05 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= 2;
        if (this.life <= 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life / 100;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 4, 4);
        ctx.globalAlpha = 1.0;
    }
}
