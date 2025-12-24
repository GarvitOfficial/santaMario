export default class MysteryBox {
    constructor(game, x, y, content) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.content = content || 'coin'; // 'coin', 'snowball', 'candy'
        this.active = true;
        this.bumpOffset = 0;
    }

    update(player) {
        if (!this.active) return;

        // Collision Check (Bottom of block vs Top of Player)
        // We only care if player hits it from below
        if (player.x + player.width > this.x && player.x < this.x + this.w &&
            player.y < this.y + this.h && player.y + player.height > this.y) {

            // Check relative velocity ? Or just relative position previous frame?
            // Simple heuristic: If player is moving UP and overlap is small-ish
            if (player.vy < 0 && player.y > this.y + this.h - 20) {
                this.trigger();
                player.vy = 0; // Stop player head bonk
                player.y = this.y + this.h;
            } else {
                // Normal collision (solid block)
                // Top land
                if (player.vy > 0 && player.y + player.height < this.y + this.h) {
                    player.y = this.y - player.height;
                    player.vy = 0;
                    player.grounded = true;
                    player.jumps = 0;
                }
            }
        }
    }

    trigger() {
        this.active = false;
        this.bumpOffset = -10;
        setTimeout(() => this.bumpOffset = 0, 100);
        this.game.spawnPowerUp(this.content, this.x + 10, this.y - 40);
        this.game.audio.playTone(600, 'square', 0.1); // Bump sound
    }

    draw(ctx) {
        if (this.active) {
            ctx.fillStyle = '#f8b229'; // Gold
            ctx.fillRect(this.x, this.y + this.bumpOffset, this.w, this.h);

            ctx.fillStyle = '#000';
            ctx.font = '30px Arial';
            ctx.fillText("?", this.x + 15, this.y + 35 + this.bumpOffset);

            // Border
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x, this.y + this.bumpOffset, this.w, this.h);
        } else {
            ctx.fillStyle = '#8b4513'; // Brown used
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
}
