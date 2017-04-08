/*---------------------------------
* キー入力による処理関数
----------------------------------*/

var input_key_buffer = new Array();

document.onkeydown = function(e) {
    if (!e) e = window.event;

    input_key_buffer[e.keyCode] = true;
};

document.onkeyup = function(e) {
    if (!e) e = window.event;

    input_key_buffer[e.keyCode] = false;
};

window.onblur = function() {
    input_key_buffer.length = 0;
};

function KeyIsDown(key_code) {
    if (input_key_buffer[key_code]) return true;
    return false;
}

setInterval(function() {
    player.move_x = 0;
    player.move_y = 0;

    // 左
    if (KeyIsDown(65) || KeyIsDown(37)) {
        player.move_x = -1;
    }
    // 下
    if (KeyIsDown(87) || KeyIsDown(38)) {
        player.move_y = -1;
    }
    // 右
    if (KeyIsDown(68) || KeyIsDown(39)) {
        player.move_x = 1;
    }
    // した
    if (KeyIsDown(83) || KeyIsDown(40)) {
        player.move_y = 1;
    }

    if (KeyIsDown(32)) {
        anubisStart = true;
    }

}, 1000 / 60);
