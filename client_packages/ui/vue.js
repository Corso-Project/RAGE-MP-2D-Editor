const body = new Vue({
    el: '#textEditor',
    data: {
        textSettings: {
            fontID: 0,
            fonts: [0, 1, 2, 4, 7],
            showFont: 0,

            cursorText: false,
            cursorRect: false,

            editText: false,
        },
        mouse: {
            X: 0,
            Y: 0,
            flow: false,
            free: true,
        },
        soundsStatus: {
            gtasa: false,
        },
        soundsLink: {
            hover: 'https://instaud.io/_/3jrd.ogg',
            mainTheme: new Audio('https://instaud.io/_/3jrn.mp3'),
        },
        elements: [
            // { type: 'text', id: 0 },
        ],
    },
    mounted() {
        document.addEventListener('keydown', (event) => {
            // console.log(event);
            /* if (/[a-zA-Z0-9-_ ]/.test(event.key)) {
                if (event.key === 'Shift' || event.key === 'Tab' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Escape') return;
                console.log(`ss ${event.key}`);
            } */
            if (this.textSettings.editText) {
                if (event.which === 8) {
                    mp.trigger('editText', 0, true);
                } else if (!/[a-zA-Z0-9-_ ]/.test(event.key)) {
                    console.log('error');
                    mp.trigger('error', 'letter');
                } else {
                    if (event.key === 'Shift' || event.key === 'Tab' || event.key === 'Control'
                        || event.key === 'Alt' || event.key === 'Escape' || event.key === 'CapsLock' || event.key === 'Enter'
                        || event.key === 'Unidentified') return;
                    if (event.shiftKey) mp.trigger('editText', event.key.toUpperCase());
                    else mp.trigger('editText', event.key);
                }
            }
        });
    },
    methods: {
        key(event) {
            console.log('key');
        },
        click() {
            this.mouse.flow = !this.mouse.flow;
        },
        off() {
            this.mouse.flow = false;
        },
        onMouseMove(e) {
            if (this.mouse.flow) {
                this.mouse.X = e.pageX;
                this.mouse.Y = e.pageY;

                const d = document.getElementById('block');
                d.style.position = 'absolute';

                d.style.left = `${e.pageX - (window.screen.width / 10)}px`;
                d.style.top = `${e.pageY}px`;
            }
        },
        hoverSound() {
            new Audio(this.soundsLink.hover).play();
        },
        hoverSoundEgg() {
            if (!this.soundsStatus.gtasa) {
                this.soundsLink.mainTheme.play();
            } else {
                this.soundsLink.mainTheme.pause();
                this.soundsLink.mainTheme.currentTime = 0;
            }
            this.soundsStatus.gtasa = !this.soundsStatus.gtasa;
        },
        toClient(option) {
            if (this.mouse.flow) return;
            if (option === 'newText') {
                console.log('text');
                mp.trigger('createNewText');
            } else if (option === 'editText') {
                console.log('editText');
                this.textSettings.editText = !this.textSettings.editText;
                if (this.textSettings.editText) {
                    mp.trigger('help', 'Edit text');
                }
                // mp.trigger('chatSettings', !this.textSettings.editText);
            } else if (option === 'color') {
                console.log('color');
            } else if (option === 'scale') {
                console.log('scale');
            } else if (option === 'deleteText') {
                console.log('deleteText');
                mp.trigger('deleteText');
            } else if (option === 'cursorToggle') {
                if (this.textSettings.cursorText === true || this.textSettings.cursorRect === true) return;
                console.log('cursorToggle');

                this.textSettings.cursorText = !this.textSettings.cursorText;
                mp.trigger('cursorToggle', this.textSettings.cursorText);
            } else if (option === 'exportSelect') {
                console.log('exportSelect');
                mp.trigger('exportSelect');
            } else if (option === 'exportAll') {
                console.log('exportAll');
                mp.trigger('exportAll');
            } else if (option === 'newRect') {
                console.log('newRect');
                mp.trigger('createNewRect');
            } else if (option === 'cursorToggleRect') {
                if (this.textSettings.cursorText === true || this.textSettings.cursorRect === true) return;
                console.log('cursorToggleRect');
                this.textSettings.cursorRect = !this.textSettings.cursorRect;
                mp.trigger('cursorToggleRect', this.textSettings.cursorRect);
            } else if (option === 'deleteRect') {
                console.log('deleteRect');
                mp.trigger('deleteRect');
            }
        },
        slider(option) {
            if (option === true) {
                this.textSettings.fontID += 1;
                if (this.textSettings.fontID === this.textSettings.fonts.length) {
                    this.textSettings.fontID = 0;
                }
                this.textSettings.showFont = this.textSettings.fonts[this.textSettings.fontID];
            } else if (option === false) {
                this.textSettings.fontID -= 1;
                console.log(`s ${this.textSettings.fontID}`);
                if (this.textSettings.fontID === -1) {
                    this.textSettings.fontID = this.textSettings.fonts.length - 1;
                }
                console.log(this.textSettings.fontID);
                this.textSettings.showFont = this.textSettings.fonts[this.textSettings.fontID];
            }
            mp.trigger('changeFont', this.textSettings.showFont);
        },
        sliderX(option) {
            if (option === true) {
                this.textSettings.fontID += 1;
                if (this.textSettings.fontID === this.textSettings.fonts.length) {
                    this.textSettings.fontID = 0;
                }
                this.textSettings.showFont = this.textSettings.fonts[this.textSettings.fontID];
            } else if (option === false) {
                this.textSettings.fontID -= 1;
                console.log(`s ${this.textSettings.fontID}`);
                if (this.textSettings.fontID === -1) {
                    this.textSettings.fontID = this.textSettings.fonts.length - 1;
                }
                console.log(this.textSettings.fontID);
                this.textSettings.showFont = this.textSettings.fonts[this.textSettings.fontID];
            }
            mp.trigger('changeFont', this.textSettings.showFont);
        },
        selectElement(id, string) {
            mp.trigger('selectElement', id, string);
        },
        editElement(id, text) {
            // this.elements.splice(this.elements.findIndex(item => item.id === id), 1);
            this.elements.findIndex((item) => {
                if (item.id === id) {
                    item.string = text;
                }
            });
        },
    },
});
