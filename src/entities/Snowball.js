export default class Snowball {
    constructor(x, y, vx) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.width = 10;
        this.height = 10;
        this.markedForDeletion = false;
        this.traveled = 0;
    }

    update() {
        this.x += this.vx;
        this.traveled += Math.abs(this.vx);
        if (this.traveled > 600) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}
