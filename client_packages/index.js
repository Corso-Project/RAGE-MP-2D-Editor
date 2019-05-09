mp.gui.execute("const _enableChatInput = enableChatInput;enableChatInput = (enable) => { mp.trigger('chatEnabled', enable); _enableChatInput(enable) };");
mp.events.add('chatEnabled', (isOpen) => {
    mp.gui.chat.enabled = isOpen;
});
// mp.gui.chat.activate(false);

/* Variables */
const TextEditor = {
    browser: null,
    statusShow: false,

    cursor: false,
    // cursorRect: false,

    moveValue: 0.01,
    selected: 0,
    ID: 0,
    created: null, // true = Text | false = Rect
    drawTexts: new Map(),
    drawRects: new Map(),
};

mp.keys.bind(0x71, true, () => {
    /* if (TextEditor.browser && mp.browsers.exists(TextEditor.browser)) {
        mp.gui.cursor.show(false, false);
        // TextEditor.browser.destroy();
        TextEditor.browser.execute("document.getElementById('textEditor').style.display = 'none'");
    } else {
        if (!TextEditor.browser && !mp.browsers.exists(TextEditor.browser)) {
            TextEditor.browser = mp.browsers.new('package://ui/index.html');
        } else TextEditor.browser.execute("document.getElementById('textEditor').style.display = 'block'");
        // TextEditor.browser = mp.browsers.new('https://www.cssscript.com/demo/color-picker-component-pickr/');
        setTimeout(() => {
            mp.gui.cursor.show(true, true);
        }, 1 * 1000);
    } */
    if (!TextEditor.browser && !mp.browsers.exists(TextEditor.browser) && !TextEditor.statusShow) {
        TextEditor.browser = mp.browsers.new('package://ui/index.html');
        TextEditor.statusShow = true;
        setTimeout(() => {
            mp.gui.cursor.show(true, true);
        }, 1 * 1000);
        mp.gui.chat.push('3');
    } else if (TextEditor.statusShow) {
        TextEditor.browser.execute("document.getElementById('textEditor').style.display = 'none'");
        TextEditor.statusShow = false;
        mp.gui.cursor.show(false, false);
        mp.gui.chat.push('2');
    } else if (!TextEditor.statusShow) {
        TextEditor.browser.execute("document.getElementById('textEditor').style.display = 'block'");
        mp.gui.chat.push('1');
        TextEditor.statusShow = true;
        setTimeout(() => {
            mp.gui.cursor.show(true, true);
        }, 1 * 1000);
    }
});

// const drawTexts = new Map();

/* Functions */
function addDrawText(text = 'RAGE', x = 0.5, y = 0.5, font = 0, color = [255, 255, 255, 255], scaleX = 1, scaleY = 1, outline = false) {
    TextEditor.ID += 1;
    TextEditor.selected = TextEditor.ID;
    TextEditor.drawTexts.set(TextEditor.ID, {
        text, x, y, font, color, scaleX, scaleY, outline,
    });
    mp.game.graphics.notify(`You create element with ~g~${TextEditor.ID}~w~ ID.`);
    TextEditor.created = true;
    TextEditor.browser.execute(`body.elements.push({ string: '${text}', id: ${TextEditor.ID} });`);
    TextEditor.browser.execute(`body.setSelected(${TextEditor.ID})`);
    return TextEditor.ID;
}
function removeDrawText(handle) {
    // TextEditor.drawTexts.delete(handle);
    mp.gui.chat.push(handle);
    if (handle === undefined) {
        mp.gui.chat.push("I can't delete it, sir.");
    } else TextEditor.drawTexts.delete(handle);
}
function getDrawText(handle) {
    return TextEditor.drawTexts.get(handle);
}
function setDrawText(handle, value) {
    return TextEditor.drawTexts.set(handle, value);
}
/* RAGE:MP Events */
const RenderEvent = new mp.Event('render', () => {
    // mp.gui.chat.push(`size: ${TextEditor.drawTexts.size}`);
    for (const info of TextEditor.drawTexts.values()) {
        if (TextEditor.cursor && TextEditor.created && getDrawText(TextEditor.selected) !== undefined) {
            const resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
            const cursorPos = mp.gui.cursor.position;
            getDrawText(TextEditor.selected).x = cursorPos[0] / resolution.x;
            getDrawText(TextEditor.selected).y = cursorPos[1] / resolution.y;
        }
        mp.game.graphics.drawText(info.text, [info.x, info.y], {
            font: info.font,
            color: info.color,
            scale: [info.scaleX, info.scaleY],
            outline: info.outline,
        });
    }
});

/* Another Events */
mp.events.add('createNewText', () => {
    addDrawText();
});
mp.events.add('editText', (value, backspace = false) => {
    if (!TextEditor.drawTexts.get(TextEditor.selected)) {
        mp.events.call('error', 'createText');
        TextEditor.browser.execute('body.textSettings.editText = false;');
    } else if (backspace === true) {
        TextEditor.drawTexts.get(TextEditor.selected).text = TextEditor.drawTexts.get(TextEditor.selected).text.substring(0, TextEditor.drawTexts.get(TextEditor.selected).text.length - 1);
        TextEditor.browser.execute(`body.editElement(${TextEditor.selected}, '${TextEditor.drawTexts.get(TextEditor.selected).text}');`);
    } else {
        TextEditor.drawTexts.get(TextEditor.selected).text += value;
        TextEditor.browser.execute(`body.editElement(${TextEditor.selected}, '${TextEditor.drawTexts.get(TextEditor.selected).text}');`);
    }
});
mp.events.add('changeFont', (value) => {
    getDrawText(TextEditor.selected).font = value;
});
mp.events.add('deleteText', () => {
    removeDrawText(TextEditor.selected);
});
mp.events.add('cursorToggle', (status) => {
    if (!TextEditor.created) TextEditor.created = true;
    TextEditor.cursor = status;
});
mp.events.add('error', (code) => {
    if (code === 'createText') {
        mp.game.graphics.notify('You should be create a 2D Text to edit it.');
    } else if (code === 'letter') {
        mp.game.graphics.notify('Only letter or numbers.');
    }
});
mp.events.add('help', (code) => {
    if (code === 'Edit text') {
        if (!TextEditor.drawTexts.get(TextEditor.selected)) {
            mp.events.call('error', 'createText');
            TextEditor.browser.execute('body.textSettings.editText = false;');
        } else {
            mp.gui.chat.show(false);
            mp.game.graphics.notify('Use your keyboard to edit text, then press again on ~r~Edit text~w~ to disable it.');
        }
    }
});

mp.events.add('setColor', (R, G, B, A) => {
    mp.gui.chat.push(`${R}, ${G}, ${B}, ${A}`);
    if (getDrawText(TextEditor.selected)) {
        getDrawText(TextEditor.selected).color = [R, G, B, A * 255];
    }
});
mp.events.add('selectElement', (id, string) => {
    mp.game.graphics.notify(`You selected element with ~r~${id}~w~ ID.`);
    TextEditor.selected = id;
});
/* Keys */
mp.keys.bind(0x25, true, () => { // left arrow
    if (mp.gui.chat.enabled) return;

    getDrawText(TextEditor.selected).x = getDrawText(TextEditor.selected).x - TextEditor.moveValue;
});
mp.keys.bind(0x26, true, () => { // up arrow
    if (mp.gui.chat.enabled) return;

    getDrawText(TextEditor.selected).y = getDrawText(TextEditor.selected).y - TextEditor.moveValue;
});
mp.keys.bind(0x27, true, () => { // right arrow
    if (mp.gui.chat.enabled) return;

    getDrawText(TextEditor.selected).x = getDrawText(TextEditor.selected).x + TextEditor.moveValue;
});
mp.keys.bind(0x28, true, () => { // down arrow
    if (mp.gui.chat.enabled) return;

    getDrawText(TextEditor.selected).y = getDrawText(TextEditor.selected).y + TextEditor.moveValue;
});
mp.keys.bind(0x12, true, () => {
    if (!TextEditor.statusShow) return;
    mp.gui.cursor.show(true, true);
});

mp.events.add('click', (absoluteX, absoluteY, upOrDown, leftOrRight) => {
    if (TextEditor.cursor && upOrDown === 'down' && leftOrRight === 'left') {
        TextEditor.cursor = !TextEditor.cursor;
        TextEditor.browser.execute(`body.textSettings.cursorText = ${TextEditor.cursor}`);
    }
});
mp.events.add('changeScale', (value1, value2) => {
    getDrawText(TextEditor.selected).scaleX = value1.toPrecision(2);
    getDrawText(TextEditor.selected).scaleY = value2.toPrecision(2);
    mp.gui.chat.push(`scale: ${JSON.stringify(getDrawText(TextEditor.selected))}`);
});
// Old
mp.events.add('scale_', (scale_value) => {
    const Scale_Split = scale_value.toString().split(',');

    getDrawText(TextEditor.selected).scaleX = Scale_Split[0];
    getDrawText(TextEditor.selected).scaleY = Scale_Split[1];
});
mp.events.add('exportSelect', () => {
    mp.events.callRemote('Export_2D_text',
        getDrawText(TextEditor.selected).text,
        getDrawText(TextEditor.selected).x, getDrawText(TextEditor.selected).y,
        getDrawText(TextEditor.selected).font,
        getDrawText(TextEditor.selected).color[0], getDrawText(TextEditor.selected).color[1], getDrawText(TextEditor.selected).color[2], getDrawText(TextEditor.selected).color[3],
        getDrawText(TextEditor.selected).scaleX, getDrawText(TextEditor.selected).scaleY,
        getDrawText(TextEditor.selected).outline);
});
mp.events.add('exportAll', () => {
    for (const info of TextEditor.drawTexts.values()) {
        mp.events.callRemote('Export_2D_text',
            info.text,
            info.x, info.y,
            info.font,
            info.color[0], info.color[1], info.color[2], info.color[3],
            info.scaleX, info.scaleY,
            info.outline);
    }
});

//
mp.events.add('toChat', (string) => {
    mp.gui.chat.push(`${string}`);
});
