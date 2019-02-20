const fs = require('fs');

mp.events.addCommand('scale', (player, fullText) => {
    if (fullText === undefined) return player.outputChatBox('/scale [x, y] - change value of scale for 2D text. Ex: /scale 0.5, 0.5');

    fullText = fullText.replace(/\s/g, '');
    player.call('scale_', [fullText]);
});

const something = (player, text,
    x, y,
    _font,
    _color0, _color1, _color2, _color3,
    _scale0, _scale1,
    _outline) => {
    const saveFile = 'saved_2D_text.txt';

    fs.appendFile(saveFile,
        `\r\nmp.game.graphics.drawText("${text}", [${x}, ${y}], {\r\n
    font: ${_font},\r\n
    color: [${_color0},${_color1},${_color2},${_color3}],\r\n
    scale: [${_scale0},${_scale1}],\r\n
    outline: ${_outline}\r\n
});`, (err) => {
            if (err) throw err;
            console.log(`"${text}" was exported in saved_2D_text.txt`);
        });
};
mp.events.add('Export_2D_text', something);
