import InputHandler from './systems/InputHandler.js';
import Player from './entities/Player.js';
import Camera from './systems/Camera.js';
import Level from './levels/Level.js';
import { level1 } from './levels/level1.js';
import SpriteLoader from './utils/SpriteLoader.js';
import AudioSystem from './systems/AudioSystem.js';
import Gift from './entities/Gift.js';
import ParticleSystem from './systems/Particles.js';
import ParallaxBackground from './systems/Parallax.js';
import Snowman from './entities/Snowman.js';
import MysteryBox from './entities/MysteryBox.js';
import PowerUp from './entities/PowerUp.js';
import Snowball from './entities/Snowball.js';
import Boss from './entities/Boss.js';
import Trap from './entities/Trap.js';
import WorldManager from './systems/WorldManager.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.lastTime = 0;
        this.score = 0;
        this.gameOver = false;

        // Resize canvas to fit window
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.input = new InputHandler();
        window.addEventListener('resize', () => this.resize());

        this.input = new InputHandler();
        this.worldManager = new WorldManager(this); // Core System
        this.camera = new Camera(this.width, this.height);
        this.audio = new AudioSystem();
        this.particles = new ParticleSystem(this);
        this.bg = new ParallaxBackground(this);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    async init() {
        console.log("Game Initialized");

        // Load Assets
        try {
            this.assets = {};
            const basePath = import.meta.env.BASE_URL || '/';
            this.assets.santa = await SpriteLoader.load(`${basePath}assets/images/santa.png`);
            this.assets.tile = await SpriteLoader.load(`${basePath}assets/images/tile.png`);
            // Placeholder for gift if I had one, or just use code
        } catch (e) {
            console.error("Failed to load assets", e);
        }

        this.bindEvents();
        // Start loop
        requestAnimationFrame((ts) => this.loop(ts));
    }

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('hud').classList.remove('hidden');

            // Init Audio Context on interaction
            if (this.audio.ctx.state === 'suspended') {
                this.audio.ctx.resume();
            }

            this.start();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-screen').classList.add('hidden');
            document.getElementById('hud').classList.remove('hidden');
            this.start();
        });
    }

    start() {
        this.score = 0;
        this.updateScore(0);
        this.updateHealth(3);
        this.victoryMode = false;
        this.gameOver = false;
        this.currentLevel = new Level(level1, this.assets);

        // Parse gifts from Level Data (which are just {x,y} objects) into Entities
        this.gifts = this.currentLevel.gifts.map(g => new Gift(g.x, g.y));

        // Spawn Enemies (Manually for now, ideally from Level)
        this.enemies = [
            new Snowman(this, 1400, 340),
            new Snowman(this, 2200, 440),
            new Snowman(this, 3000, 440)
        ];

        // Spawn Mystery Boxes (Manual for now)
        this.mysteryBoxes = [
            new MysteryBox(this, 300, 300, 'snowball'),
            new MysteryBox(this, 800, 300, 'coin'), // coin logic not in PowerUp yet but ok
            new MysteryBox(this, 2100, 250, 'candy')
        ];

        // Spawn Traps
        this.traps = [
            // Pit spikes
            new Trap(1600, 480, 300, 30, 'spikes'),
            new Trap(3500, 480, 1000, 30, 'spikes') // Boss arena hazard
        ];

        // Spawn Boss (At the end)
        // Level length is 4000. Arena at 3800.
        this.boss = new Boss(this, 3800, 400);

        this.powerups = [];
        this.projectiles = [];

        this.player = new Player(this, this.assets ? this.assets.santa : null);
        this.player.y = 400; // Start bit higher
        this.camera.worldWidth = this.currentLevel.width;

        // Init Visuals
        this.particles.createSnow();
    }

    update(deltaTime) {
        if (this.gameOver || !this.player) return;

        this.player.update(this.input, this.currentLevel.platforms);
        this.camera.update(this.player);
        this.bg.update(this.camera);
        this.particles.update(deltaTime);

        // Update Enemies
        this.enemies.forEach(e => e.update(deltaTime, this.player));
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // Update Mystery Boxes
        this.mysteryBoxes.forEach(b => b.update(this.player));

        // Update Powerups
        this.powerups.forEach(p => p.update(deltaTime));
        this.powerups = this.powerups.filter(p => !p.markedForDeletion);

        // Update Projectiles
        this.projectiles.forEach(p => {
            p.update();
            // Check Collision with Enemies
            this.enemies.forEach(e => {
                if (!e.markedForDeletion &&
                    p.x < e.x + e.width && p.x + p.width > e.x &&
                    p.y < e.y + e.height && p.y + p.height > e.y) {

                    e.markedForDeletion = true;
                    p.markedForDeletion = true;
                    this.score += 200;
                    this.addXp(50); // XP
                    this.updateScore(this.score);
                    this.audio.playTone(200, 'sawtooth', 0.1); // Hit sound
                }
            });
            // Check Collision with Boss
            if (this.boss && !this.boss.markedForDeletion &&
                p.x < this.boss.x + this.boss.width && p.x + p.width > this.boss.x &&
                p.y < this.boss.y + this.boss.height && p.y + p.height > this.boss.y) {
                this.boss.takeDamage(1);
                p.markedForDeletion = true;
            }
        });

        // DEV CHEATS for Multiverse
        if (this.input.keys.has('1')) this.worldManager.switchWorld(0);
        if (this.input.keys.has('2')) this.worldManager.switchWorld(1);
        if (this.input.keys.has('3')) this.worldManager.switchWorld(2);
        if (this.input.keys.has('4')) this.worldManager.switchWorld(3);
        if (this.input.keys.has('5')) this.worldManager.switchWorld(4);

        // Update Boss
        if (this.boss && !this.boss.markedForDeletion) {
            this.boss.update(deltaTime, this.player);
        }

        // Check Traps
        this.traps.forEach(t => {
            if (this.player.x < t.x + t.w && this.player.x + this.player.width > t.x &&
                this.player.y < t.y + t.h && this.player.y + this.player.height > t.y) {
                this.takeDamage(1);
                this.player.vy = -10; // Bounce up
            }
        });

        // Cinematic Victory
        if (this.victoryMode) {
            if (Math.random() < 0.1) {
                this.particles.createExplosion(
                    this.camera.x + Math.random() * this.width,
                    Math.random() * this.height / 2
                );
                this.audio.playTone(Math.random() * 400 + 400, 'sine', 0.5);
            }
        }

        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        // Audio Hook for Jump
        if (this.player.jumpPressed && (this.player.vy === this.player.jumpPower)) {
            this.audio.playJump();
        }

        // Gift Collisions
        this.gifts.forEach(g => {
            if (!g.collected &&
                this.player.x < g.x + g.width &&
                this.player.x + this.player.width > g.x &&
                this.player.y < g.y + g.height &&
                this.player.y + this.player.height > g.y) {
                g.collected = true;
                this.score += 100;
                this.updateScore(this.score);
                this.audio.playCollect();
            }
        });

        // Win Check (Removed simple X check, now Boss based or manually called by Boss death)
        // if (this.player.x > this.currentLevel.width - 200) { this.winGame(); }

        // Pit Death check inside Player, but let's handle Game Over state here if needed
        if (this.player.y > 1000) {
            // Simple respawn for now (infinite lives)
            // Or Game Over? Let's respawn but lose score
            this.player.x = 100;
            this.player.y = 0;
            this.score = Math.max(0, this.score - 50);
            this.updateScore(this.score);
        }
    }

    updateScore(s) {
        document.getElementById('score-display').innerText = `Score: ${s}`;
    }

    updateHealth(h) {
        document.getElementById('lives-display').innerText = "❤️".repeat(h);
    }

    takeDamage(amount) {
        if (this.player.health <= 0) return;

        this.player.health -= amount;
        this.updateHealth(this.player.health);
        this.audio.playTone(150, 'sawtooth', 0.3); // Hurt sound

        if (this.player.health <= 0) {
            // Game Over logic
            this.gameOver = true;
            document.getElementById('game-over-title').innerText = "Game Over";
            document.getElementById('final-score').innerText = `Score: ${this.score}`;
            document.getElementById('game-over-screen').classList.remove('hidden');
            document.getElementById('hud').classList.add('hidden');
        } else {
            // Respawn logic
            // Reset position to safe spot (start of level or last stable ground)
            // Ideally check points. For now: Start of level.
            this.player.x = 100;
            this.player.y = 0;
            this.player.vx = 0;
            this.player.vy = 0;
            // Flash effect?
        }
    }

    spawnPowerUp(type, x, y) {
        if (type === 'coin') {
            this.score += 50; // Just instant score for coins for now
            this.updateScore(this.score);
        } else {
            this.powerups.push(new PowerUp(this, type, x, y));
        }
    }

    spawnSnowball(x, y, vx) {
        this.projectiles.push(new Snowball(x, y, vx));
        this.audio.playTone(800, 'square', 0.05); // Pew sound
    }

    winGame() {
        this.victoryMode = true; // Loop fireworks
        // Delay Game over screen for effect
        setTimeout(() => {
            this.gameOver = true;
            this.audio.playWin();
            document.getElementById('game-over-title').innerText = "V I C T O R Y !";
            document.getElementById('final-score').innerText = `Final Score: ${this.score}`;
            document.getElementById('game-over-screen').classList.remove('hidden');
            document.getElementById('hud').classList.add('hidden');
        }, 3000);
    }

    onWorldChange(worldConfig) {
        console.log("Entering: " + worldConfig.name);
        // Reset particles?
        // Change background? (Handled in draw via worldConfig)
        this.particles.particles = []; // Clear
        // Re-create background if needed
        // Notify UI
        // Use existing HUD for testing (put text somewhere?)
        document.getElementById('start-btn').innerText = worldConfig.name; // Hacky display
    }

    addXp(amount) {
        this.xp += amount;
        if (this.xp > this.level * 100) {
            this.level++;
            this.xp = 0; // Overflow?
            this.audio.playWin(); // Level up sound
            // Increase health cap?
            this.player.health = 3 + Math.floor(this.level / 2);
            this.updateHealth(this.player.health);
        }
    }

    draw() {
        // Clear screen
        this.ctx.clearRect(0, 0, this.width, this.height);

        const world = this.worldManager.getCurrent();

        // 1. Draw Sky (Gradient based on World)
        let grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, world.bgColors[0]);
        grad.addColorStop(1, world.bgColors[1]);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2. Parallax Backgrounds (Behind everything)
        this.bg.draw(this.ctx);

        if (this.player) {
            this.camera.apply(this.ctx);

            this.currentLevel.drawPlatforms(this.ctx);

            // Draw Gifts
            this.gifts.forEach(g => g.draw(this.ctx));

            // Draw Enemies
            this.enemies.forEach(e => e.draw(this.ctx));

            if (this.boss && !this.boss.markedForDeletion) {
                this.boss.draw(this.ctx);
            }

            // Draw Traps
            this.traps.forEach(t => t.draw(this.ctx));

            // Draw Mystery Boxes
            this.mysteryBoxes.forEach(b => b.draw(this.ctx));

            // Draw Powerups
            this.powerups.forEach(p => p.draw(this.ctx));

            // Draw Projectiles
            this.projectiles.forEach(p => p.draw(this.ctx));

            this.player.draw(this.ctx);

            this.camera.reset(this.ctx);
        }

        // 3. Particles (Foreground)
        this.particles.draw(this.ctx);

        if (!this.player) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.fillText("Press Start", this.width / 2 - 70, this.height / 2);
        }
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((ts) => this.loop(ts));
    }
}
