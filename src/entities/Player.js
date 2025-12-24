export default class Player {
    constructor(game, sprite) {
        this.game = game;
        this.game = game;
        this.sprite = sprite;
        this.width = 50;
        this.height = 80;
        this.x = 100;
        this.y = 0; // Will fall to ground
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        // Physics now derived from World
        this.grounded = false;
        this.color = '#d42426'; // Santa Red
        this.health = 3;
        this.canShoot = false;
        this.lastShot = 0;

        // Double jump capability
        this.jumps = 0;
        this.maxJumps = 2;
    }

    update(input, platforms) {
        const world = this.game.worldManager.getCurrent();

        // Horizontal Movement with Acceleration
        const ACCEL = 1; // Could also be world dependent
        if (input.keys.has('ArrowRight') || input.keys.has('d')) {
            this.vx += ACCEL;
        } else if (input.keys.has('ArrowLeft') || input.keys.has('a')) {
            this.vx -= ACCEL;
        }

        // Jumping
        if ((input.keys.has('ArrowUp') || input.keys.has(' ') || input.keys.has('w'))) {
            if (this.grounded && !this.jumpPressed) {
                this.vy = world.jumpPower;
                this.grounded = false;
                this.jumps = 1;
                this.jumpPressed = true;
                this.game.audio.playJump(); // Trigger sound here for responsiveness
            } else if (!this.grounded && this.jumps < this.maxJumps && !this.jumpPressed) {
                this.vy = world.jumpPower;
                this.jumps++;
                this.jumpPressed = true;
                this.game.audio.playJump();
            }
        } else {
            this.jumpPressed = false;
        }

        this.vy += world.gravity;

        // Friction Logic
        // Apply friction to vx to bring it to 0 if no input
        if (!input.keys.has('ArrowRight') && !input.keys.has('d') &&
            !input.keys.has('ArrowLeft') && !input.keys.has('a')) {
            this.vx *= world.friction; // Dynamic friction
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        // Clamp Max Speed
        const MAX_SPEED = this.speed; // Could be world dependent
        if (this.vx > MAX_SPEED) this.vx = MAX_SPEED;
        if (this.vx < -MAX_SPEED) this.vx = -MAX_SPEED;

        // Apply Physics
        this.x += this.vx;
        this.y += this.vy;

        // Platform Collisions (Simple AABB)
        this.grounded = false;

        for (let p of platforms) {
            // Check if player is within horizontal bounds of platform
            if (this.x < p.x + p.w && this.x + this.width > p.x) {
                // Check falling onto top
                if (this.y + this.height > p.y && this.y + this.height < p.y + p.h + this.vy && this.vy >= 0) {
                    this.y = p.y - this.height;
                    this.vy = 0;
                    this.grounded = true;
                    this.jumps = 0;
                }
            }
        }

        // Fall off world
        if (this.y > 1000) {
            // Respawn for now
            this.y = 0;
            this.x = 100;
            this.vy = 0;
        }

        // Screen boundaries (left only)
        if (this.x < 0) this.x = 0;

        // Shooting
        if (this.canShoot && input.keys.has('z')) {
            const now = Date.now();
            if (now - this.lastShot > 300) { // Cooldown
                this.lastShot = now;
                // Tell Game to spawn projectile
                const dir = this.vx >= 0 ? 1 : -1; // If idle, assume right? Or keep last direction?
                // Actually, if vx is 0, we need last direction.
                // Let's assume right if 0 for now or store facing.
                let shootDir = 1;
                if (this.vx < 0) shootDir = -1;
                // Improve: Store facingDir in player

                this.game.spawnSnowball(this.x + this.width / 2, this.y + 20, shootDir * 10);
            }
        }
    }

    draw(ctx) {
        if (this.sprite) {
            // Simple sprite drawing (assuming a sheet, but just drawing frame 0 for now)
            // If the sprite is complex (grid), we need to source rect.
            // Let's assume the sprite sheet has 3x3 grid approx, let's just draw the top left for Idle
            // But for safety, let's just draw the whole image scaled first to see it, 
            // OR better: Draw a sub-region if we know the size. 
            // Given I don't know the generated size, I'll attempt to draw a crop.
            // Assuming typical 32x32 or 64x64 sprites.

            ctx.save();
            if (this.vx < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(this.sprite, 0, 0, this.sprite.width / 3, this.sprite.height / 3, -this.x - this.width, this.y, this.width, this.height);
            } else {
                // Draw the first frame (Idle)
                // SourceX, SourceY, SourceW, SourceH, DestX, DestY, DestW, DestH
                // Heuristic: Use 1/3 of width and 1/3 height as single frame
                ctx.drawImage(this.sprite, 0, 0, this.sprite.width / 3, this.sprite.height / 3, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Draw a little hat to indicate direction (visual debug)
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.width, 20);

            // Eyes
            ctx.fillStyle = 'black';
            if (this.vx >= 0) {
                ctx.fillRect(this.x + 35, this.y + 25, 5, 5);
            } else {
                ctx.fillRect(this.x + 10, this.y + 25, 5, 5);
            }
        }
    }
}
