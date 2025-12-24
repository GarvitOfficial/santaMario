export default class WorldManager {
    constructor(game) {
        this.game = game;
        this.currentWorldI = 0;

        this.worlds = [
            {
                name: 'Ice Kingdom',
                gravity: 0.5,
                friction: 0.8,
                jumpPower: -15,
                bgColors: ['#0b1026', '#2b32b2'],
                particle: 'snow'
            },
            {
                name: 'Candy World',
                gravity: 0.4,
                friction: 0.9, // Slippery? No, Sticky? High friction.
                jumpPower: -18, // Bouncy
                bgColors: ['#ff9a9e', '#fecfef'],
                particle: 'confetti'
            },
            {
                name: 'Nightmare North',
                gravity: 0.6, // Heavy
                friction: 0.8,
                jumpPower: -12,
                bgColors: ['#000000', '#434343'],
                particle: 'ash'
            },
            {
                name: 'Cyber Christmas',
                gravity: 0.5,
                friction: 0.9,
                jumpPower: -15,
                bgColors: ['#0f0c29', '#302b63'], // Neon
                particle: 'glitch'
            },
            {
                name: 'Space Claus',
                gravity: 0.15, // Low G
                friction: 0.99, // No air resistance
                jumpPower: -8, // Gentle jump
                bgColors: ['#000000', '#000000'],
                particle: 'stars'
            }
        ];
    }

    getCurrent() {
        return this.worlds[this.currentWorldI];
    }

    switchWorld(index) {
        if (index >= 0 && index < this.worlds.length) {
            this.currentWorldI = index;
            this.game.onWorldChange(this.getCurrent());
        }
    }
}
