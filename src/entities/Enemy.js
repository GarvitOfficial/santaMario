export default class Enemy {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.vx = -2;
        this.vy = 0;
        this.markedForDeletion = false;
    }

    update(deltaTime, player) {
        this.x += this.vx;

        // Simple Patrol - turn around if hitting something? 
        // Or just move left for now (Mario Goomba style)

        // Collision with Player
        if (this.checkCollision(player)) {
            if (player.vy > 0 && player.y < this.y) {
                // Player stomped enemy
                this.markedForDeletion = true;
                player.vy = -10; // Bounce
                this.game.score += 200;
                this.game.updateScore(this.game.score);
            } else {
                // Player hurt
                this.game.takeDamage(1);
                // Knockback
                player.vx = this.vx * 2;
                player.vy = -5;
            }
        }
    }

    checkCollision(p) {
        return (p.x < this.x + this.width &&
            p.x + p.width > this.x &&
            p.y < this.y + this.height &&
            p.y + p.height > this.y);
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
