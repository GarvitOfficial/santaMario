export default class Trap {
    constructor(x, y, w, h, type) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type || 'spikes';
    }

    draw(ctx) {
        ctx.fillStyle = '#888';
        if (this.type === 'spikes') {
            // Draw zigzag
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.h);
            const spikeWidth = 10;
            for (let i = 0; i < this.w; i += spikeWidth) {
                ctx.lineTo(this.x + i + spikeWidth / 2, this.y); // Peak
                ctx.lineTo(this.x + i + spikeWidth, this.y + this.h); // Base
            }
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}
