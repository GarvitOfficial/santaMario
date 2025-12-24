export default class InputHandler {
    constructor() {
        this.keys = new Set();
        this.touchActions = new Set();

        window.addEventListener('keydown', e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'z'].includes(e.key)) {
                this.keys.add(e.key);
            }
        });

        window.addEventListener('keyup', e => {
            this.keys.delete(e.key);
        });

        this.setupTouchControls();
    }

    setupTouchControls() {
        const bindTouch = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;

            el.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys.add(key);
            });
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys.delete(key);
            });
        };

        bindTouch('btn-left', 'ArrowLeft');
        bindTouch('btn-right', 'ArrowRight');
        bindTouch('btn-jump', 'ArrowUp');
        bindTouch('btn-slide', 'ArrowDown');
        bindTouch('btn-shoot', 'z');
    }

    isDown(key) {
        return this.keys.has(key);
    }
}
