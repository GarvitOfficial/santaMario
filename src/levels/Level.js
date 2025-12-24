export default class Level {
    constructor(data, assets) {
        this.platforms = data.platforms || [];
        this.enemies = data.enemies || [];
        this.gifts = data.gifts || [];
        this.width = data.width || 3000;
        this.bg = data.bg || '#87CEEB';
        this.tile = assets ? assets.tile : null;

        if (this.tile) {
            // Create pattern
            // We can't CreatePattern here easily without a context, so we'll do it in draw or just drawImage loop
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.bg; // Background
        // We don't fill Rect the whole world here because we want parallax later, 
        // but for now, we rely on the clearRect in Game.js which shows the canvas bgColor or cleared
    }

    drawPlatforms(ctx) {
        this.platforms.forEach(p => {
            if (this.tile) {
                // Helper to tile the image
                let ptrn = ctx.createPattern(this.tile, 'repeat');
                ctx.fillStyle = ptrn;
                ctx.fillRect(p.x, p.y, p.w, p.h);

                // Border
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(p.x, p.y, p.w, p.h);
            } else {
                ctx.fillStyle = '#fff'; // Snow platforms
                ctx.fillRect(p.x, p.y, p.w, p.h);
            }

            // Ice/Snow top detail
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillRect(p.x, p.y, p.w, 10);
        });
    }
}
