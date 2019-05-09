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
        scale1: 1,
        scale2: 1,
        selectedElement: -1,
        mouse: {
            X: 0,
            Y: 0,
            flow: false,
            free: true,
        },
        soundsStatus: {
            gtasa: false,
            hoverPlay: true,
        },
        soundsLink: {
            hover: 'https://cdn.corso-project.ru/select.ogg',
            mainTheme: new Audio('https://cdn.corso-project.ru/gtasa.ogg'),
        },
        elements: [
            // { type: 'text', id: 0 },
        ],
    },
    mounted() {
        document.addEventListener('keydown', (event) => {
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
                    if (event.shiftKey) {
                        mp.trigger('editText', event.key.toUpperCase());
                    } else {
                        mp.trigger('editText', event.key);
                    }
                }
            }
        });
    },
    methods: {
        removeSome(key, value) {
            if (value === undefined) { return }
            mp.trigger('toChat', 'try to find');
            for (const i in this) {
                if (this[i][key] == value) {
                    mp.trigger('toChat', 'something is here');
                    this.splice(i, 1);
                    mp.trigger('toChat', `${JSON.stringify(this.elements)}`);
                }
            }
        },
        key(event) {
            console.log('key');
        },
        click() {
            this.mouse.flow = !this.mouse.flow;
        },
        hoverPlay() {
            this.soundsStatus.hoverPlay = !this.soundsStatus.hoverPlay;
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
            if (this.soundsStatus.hoverPlay === false) return;
            let play = new Audio(this.soundsLink.hover);
            play.play();
            play.volume = 0.5;
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
                mp.trigger('createNewText');
            } else if (option === 'editText') {
                this.textSettings.editText = !this.textSettings.editText;
                if (this.textSettings.editText) {
                    mp.trigger('help', 'Edit text');
                }
            } else if (option === 'color') {
                // console.log('color');
            } else if (option === 'scale') {
                // console.log('scale');
            } else if (option === 'deleteText') {
                mp.trigger('deleteText');

                this.elements.findIndex((item) => {
                    if (item.id === this.selectedElement) {
                        this.elements.splice(item.id - 1, 1);
                    }
                });
            } else if (option === 'cursorToggle') {
                if (this.textSettings.cursorText === true || this.textSettings.cursorRect === true) return;

                this.textSettings.cursorText = !this.textSettings.cursorText;
                mp.trigger('cursorToggle', this.textSettings.cursorText);
            } else if (option === 'exportSelect') {
                mp.trigger('exportSelect');
            } else if (option === 'exportAll') {
                mp.trigger('exportAll');
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
                if (this.textSettings.fontID === -1) {
                    this.textSettings.fontID = this.textSettings.fonts.length - 1;
                }
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
                if (this.textSettings.fontID === -1) {
                    this.textSettings.fontID = this.textSettings.fonts.length - 1;
                }
                this.textSettings.showFont = this.textSettings.fonts[this.textSettings.fontID];
            }
            mp.trigger('changeFont', this.textSettings.showFont);
        },
        scaleText(side, value) {
            if (value === 0) {
                if (side === 'left') {
                    this.scale1 -= 0.1;
                }
                if (side === 'right') {
                    this.scale1 += 0.1;
                }
            } else if (value === 1) {
                if (side === 'left') {
                    this.scale2 -= 0.1;
                }
                if (side === 'right') {
                    this.scale2 += 0.1;
                }
            }
            mp.trigger('changeScale', this.scale1, this.scale2);
        },
        selectElement(id, string) {
            mp.trigger('selectElement', id, string);
            this.selectedElement = id;
        },
        editElement(id, text) {
            this.elements.findIndex((item) => {
                if (item.id === id) {
                    item.string = text;
                }
            });
        },
        changeColor(r, g, b, a) {
            mp.trigger('setColor', r, g, b, a);
        },
        setSelected(id) {
            this.selectedElement = id;
        },
    },
});
