export default class ParallaxBackground {
    constructor(game) {
        this.game = game;
        this.layers = [
            new Layer(game, 0.2, (ctx, x, y, w, h) => this.drawMountains(ctx, x, y, w, h), '#d0e7f9'), // Far Mountains
            new Layer(game, 0.5, (ctx, x, y, w, h) => this.drawTrees(ctx, x, y, w, h), null)       // Mid Trees
        ];
    }

    drawMountains(ctx, x, y, w, h) {
        ctx.fillStyle = '#b0d0f0';
        ctx.beginPath();
        ctx.moveTo(0, h);
        // Generate some peaks based on x position
        // We need deterministic randomness based on world X
        // Simple sawtooth for now with noise
        for (let i = 0; i <= w; i += 50) {
            let noise = Math.sin((x + i) * 0.01) * 50 + Math.cos((x + i) * 0.03) * 30;
            ctx.lineTo(i, h - 200 - noise);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
    }

    drawTrees(ctx, x, y, w, h) {
        ctx.fillStyle = '#165b33';
        // Deterministic trees
        for (let i = 0; i <= w; i += 80) {
            let treeX = i;
            let worldX = x + treeX;
            // Pseudo-random placement
            if (Math.abs(Math.sin(worldX * 0.1)) > 0.3) {
                let treeH = 100 + Math.sin(worldX) * 20;
                let groundY = h - 100; // Assuming floor level ish

                // Draw Tree
                ctx.beginPath();
                ctx.moveTo(treeX, groundY - treeH);
                ctx.lineTo(treeX - 20, groundY);
                ctx.lineTo(treeX + 20, groundY);
                ctx.fill();
            }
        }
    }

    update(camera) {
        this.layers.forEach(l => l.update(camera));
    }

    draw(ctx) {
        this.layers.forEach(l => l.draw(ctx));
    }
}

class Layer {
    constructor(game, speedModifier, drawFunc, color) {
        this.game = game;
        this.speedModifier = speedModifier;
        this.drawFunc = drawFunc;
        this.color = color;
        this.x = 0;
    }

    update(camera) {
        this.x = camera.x * this.speedModifier;
    }

    draw(ctx) {
        // Parallax means we move the world opposite to camera, but scaled.
        // Actually, with Camera class applying translate, we just need to draw things at their distinct world positions? 
        // No, standard parallax is usually fixed to camera.
        // Easier approach: Draw relative to screen, using the offset to determine *what* to draw.

        ctx.save();
        // We are NOT affected by the main camera transform because we call this BEFORE camera.apply or we essentially un-apply it.
        // But since we are integrating into a loop that might apply camera... 
        // Let's assume this is drawn in a "Screen Space" loop or we revert IDK.
        // Best: We pass the camera X to generate the content.

        // Draw background color if exists
        if (this.color) {
            // This is tricky if it's not the Clear color.
            // Let's ignore full fill for now to allow layering.
        }

        this.drawFunc(ctx, this.x, 0, this.game.width, this.game.height);

        ctx.restore();
    }
}
