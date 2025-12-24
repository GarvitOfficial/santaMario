export default class Gift {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.collected = false;
        this.color = '#ffd700'; // Gold
    }

    draw(ctx) {
        if (this.collected) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Ribbon
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x + 13, this.y, 4, 30);
        ctx.fillRect(this.x, this.y + 13, 30, 4);

        // Shine
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(this.x + 2, this.y + 2, 5, 5);
        ctx.globalAlpha = 1.0;
    }
}
