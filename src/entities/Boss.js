import Enemy from './Enemy.js';

export default class Boss extends Enemy {
    constructor(game, x, y) {
        super(game, x, y);
        this.width = 100;
        this.height = 120;
        this.hp = 10;
        this.maxHp = 10;
        this.vx = 2; // Move speed
        // Patrol around spawn?
        this.startX = x;
        this.range = 300;

        this.lastAttack = 0;
        this.attackInterval = 2000; // 2 seconds
        this.color = '#eee'; // Off-white
    }

    update(deltaTime, player) {
        // Movement Logic: Move back and forth
        this.x += this.vx;
        if (this.x > this.startX + this.range) this.vx = -2;
        if (this.x < this.startX - this.range) this.vx = 2;

        // Attack Logic
        const now = Date.now();
        if (now - this.lastAttack > this.attackInterval) {
            this.lastAttack = now;
            this.attack(player);
        }

        // Collision with Player (Body Damage)
        // Boss is thicker, harder to jump over
        if (this.checkCollision(player)) {
            // Player gets hurt unless they have invincibility
            // Boss prevents simple stomp kill?
            // Let's say Boss TAKES stomp damage but Player ALSO bounces back
            if (player.vy > 0 && player.y < this.y + 20) {
                this.takeDamage(1);
                player.vy = -15; // Big bounce
                player.y = this.y - player.height - 5;
            } else {
                // Hurt player
                this.game.takeDamage(1);
                // Knockback
                player.vx = (player.x < this.x) ? -10 : 10;
                player.vy = -5;
            }
        }
    }

    attack(player) {
        // Shoot towards player
        // Simple logic: Shoot horizontally towards player direction
        // Or spawn a targeted projectile?
        // Re-use Snowball but make it "bad" (BossSnowball?)
        // For simplicity, let's just make it a generic projectile logic managed by Game or Boss
        // But Game.js manages projectiles. Let's add a method to Game to spawn enemy projectile
        // OR hack it: Boss spawns a 'Gift' that is actually harmful? No.
        // Let's create a visual tell.

        const dir = (player.x < this.x) ? -10 : 10;
        // We need game to handle 'BadSnowball'
        // For now, let's just make Boss lunge?
        // No, let's try to add projectile support if possible.
        // Let's just spawn a "BadSnowball" directly into game.projectiles with a flag?
        // Game.projectiles currently treats everything as Player ammo. 
        // Let's update Game.js to separate them or have an 'owner' tag.

        // Pivot: Boss Jumps to create shockwave?
        if (this.game.player.grounded) {
            this.vy = -10; // Jump
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.game.audio.playTone(100, 'sawtooth', 0.1); // Grunt
        if (this.hp <= 0) {
            this.markedForDeletion = true;
            this.game.score += 5000;
            this.game.winGame(); // Boss death = Win?
        }
    }

    draw(ctx) {
        // Draw Boss (Big Snowman)
        ctx.fillStyle = this.hp < 4 ? '#ffcccc' : 'white'; // Red tint if low hp

        // Body Stack
        ctx.beginPath(); ctx.arc(this.x + 50, this.y + 90, 40, 0, Math.PI * 2); ctx.fill(); // Bottom
        ctx.beginPath(); ctx.arc(this.x + 50, this.y + 50, 30, 0, Math.PI * 2); ctx.fill(); // Mid
        ctx.beginPath(); ctx.arc(this.x + 50, this.y + 20, 20, 0, Math.PI * 2); ctx.fill(); // Head

        // Face (Angry)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(this.x + 40, this.y + 15); ctx.lineTo(this.x + 45, this.y + 20); ctx.stroke(); // Eyebrow
        ctx.moveTo(this.x + 60, this.y + 15); ctx.lineTo(this.x + 55, this.y + 20); ctx.stroke();

        ctx.fillRect(this.x + 40, this.y + 18, 5, 5); // Eye
        ctx.fillRect(this.x + 55, this.y + 18, 5, 5); // Eye

        // Crown
        ctx.fillStyle = 'gold';
        ctx.fillRect(this.x + 35, this.y - 10, 30, 10);
        ctx.beginPath();
        ctx.moveTo(this.x + 35, this.y - 10); ctx.lineTo(this.x + 35, this.y - 25); ctx.lineTo(this.x + 45, this.y - 10);
        ctx.lineTo(this.x + 55, this.y - 25); ctx.lineTo(this.x + 65, this.y - 10);
        ctx.fill();

        // HP Bar overhead
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 40, 100, 10);
        ctx.fillStyle = 'lime';
        ctx.fillRect(this.x, this.y - 40, 100 * (this.hp / this.maxHp), 10);
    }
}
