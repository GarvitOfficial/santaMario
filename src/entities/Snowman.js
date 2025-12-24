import Enemy from './Enemy.js';

export default class Snowman extends Enemy {
    constructor(game, x, y) {
        super(game, x, y);
        this.width = 40;
        this.height = 60;
        this.vx = -1;
        this.patrolStart = x - 100;
        this.patrolEnd = x + 100;
    }

    update(deltaTime, player) {
        // Custom Patrol Logic
        this.x += this.vx;
        if (this.x < this.patrolStart) this.vx = 1;
        if (this.x > this.patrolEnd) this.vx = -1;

        super.update(deltaTime, player);
    }

    draw(ctx) {
        ctx.fillStyle = 'white';

        // Bottom circle
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 45, 15, 0, Math.PI * 2);
        ctx.fill();

        // Middle circle
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 25, 12, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 15, this.y + 8, 3, 3);
        ctx.fillRect(this.x + 22, this.y + 8, 3, 3);

        // Carrot Nose
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y + 12);
        ctx.lineTo(this.x + 35, this.y + 14);
        ctx.lineTo(this.x + 20, this.y + 16);
        ctx.fill();
    }
}
