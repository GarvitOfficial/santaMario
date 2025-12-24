export default class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.worldWidth = 2000; // Default, will increase
    }

    update(player) {
        // Center player
        this.x = player.x - this.width / 2 + player.width / 2;

        // Clamp camera
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.worldWidth) this.x = this.worldWidth - this.width;
    }

    apply(ctx) {
        ctx.save();
        ctx.translate(-this.x, 0); // Only scroll X for now
    }

    reset(ctx) {
        ctx.restore();
    }
}
