export default class PowerUp {
    constructor(game, type, x, y) {
        this.game = game;
        this.type = type; // 'snowball', 'candy'
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.vy = -5; // Pop up
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.vy += 0.2; // Gravity
        this.y += this.vy;

        // Stop at block height approximately
        // Simplify: Just fall until taken or generic floor check?
        // Let's just make it float down to a base y ? 
        // Nah, let's just do collision with player

        // Check collision with Player
        const p = this.game.player;
        if (this.x < p.x + p.width && this.x + this.width > p.x &&
            this.y < p.y + p.height && this.y + this.height > p.y) {

            this.markedForDeletion = true;
            this.applyEffect(p);
        }
    }

    applyEffect(player) {
        if (this.type === 'snowball') {
            player.canShoot = true;
            this.game.audio.playCollect(); // Reuse sound
            // UI message?
        } else if (this.type === 'candy') {
            player.health = Math.min(3, player.health + 1);
            this.game.updateHealth(player.health);
            this.game.audio.playCollect();
        }
    }

    draw(ctx) {
        if (this.type === 'snowball') {
            ctx.fillStyle = 'cyan';
            ctx.beginPath();
            ctx.arc(this.x + 15, this.y + 15, 10, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = 'pink'; // Candy
            ctx.fillRect(this.x, this.y, 30, 10);
            ctx.fillRect(this.x + 10, this.y, 10, 30);
        }
    }
}
