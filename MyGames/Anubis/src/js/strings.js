var centerX = (TIP_COUNT_W * TIP_W) / 2;
var centerY = (TIP_COUNT_H * TIP_W) / 2;
/**
 * スタート前(スペースキーを押す前)
 */
var moveY = 0;
var leftTimeParam;

function waitSpaceKey() {
    map_ctx.globalAlpha = 0.7;
    map_ctx.fillStyle = "#3068c1";
    map_ctx.beginPath();
    map_ctx.fillRect(4 * 32, 6 * 32, 12 * 32, 3 * 32);
    map_ctx.globalAlpha = 1;
    map_ctx.textAlign = "center";
    map_ctx.font = "Italic 40px Arial";
    map_ctx.fillStyle = "red";
    map_ctx.fillText("STAGE " + stageNum, centerX + 2, ((TIP_COUNT_H - 1) * TIP_W) / 2 + 3, 500);
    map_ctx.fillText("PRESS SPACE KEY", centerX + 2, ((TIP_COUNT_H + 2) * TIP_W) / 2 + 3, 500);
    map_ctx.fillStyle = "white";
    map_ctx.fillText("STAGE " + stageNum, centerX, ((TIP_COUNT_H - 1) * TIP_W) / 2, 500);
    map_ctx.fillText("PRESS SPACE KEY", centerX, ((TIP_COUNT_H + 2) * TIP_W) / 2, 500);
    moveY++;
}

/**
 * スタート後(スペースキーを押した直後)
 */
function drawStart() {
    map_ctx.globalAlpha = 0.7;
    map_ctx.fillStyle = "green";
    map_ctx.beginPath();
    map_ctx.fillRect(4 * TIP_W, 6 * TIP_W, 12 * TIP_W, 3 * TIP_W);
    map_ctx.globalAlpha = 1;
    map_ctx.textAlign = "center";
    map_ctx.font = "Italic 40px Arial";
    map_ctx.fillStyle = "red";
    map_ctx.fillText("START!", centerX + 2, ((TIP_COUNT_H + 1) * TIP_W) / 2 + 3, 500);
    map_ctx.fillStyle = "white";
    map_ctx.fillText("START!", centerX, ((TIP_COUNT_H + 1) * TIP_W) / 2, 500);
}

/**
 *ゲームの情報を表示
 */
function drawParam() {
    // タマシイの数を表示
    map_ctx.globalAlpha = 0.7;
    map_ctx.fillStyle = "black";
    map_ctx.beginPath();
    map_ctx.fillRect(0, 0, 7 * TIP_W - (TIP_W / 2), TIP_W);
    map_ctx.globalAlpha = 1;
    map_ctx.textAlign = "left";
    map_ctx.font = "Italic 40px Arial";
    map_ctx.fillStyle = "black";
    map_ctx.fillText("SOUL " + get_souls + " / " + SOULS_COUNT, 0 + 2, TIP_W + 3, 500);
    map_ctx.fillStyle = "white";
    map_ctx.fillText("SOUL " + get_souls + " / " + SOULS_COUNT, 0, TIP_W, 500);
    // console.log("get_souls = " + get_souls + ", SOULS_COUNT = " + SOULS_COUNT);

    // 経過時間を表示
    map_ctx.globalAlpha = 0.7;
    map_ctx.fillStyle = "black";
    map_ctx.beginPath();
    map_ctx.fillRect(14 * TIP_W, 0 * TIP_W, 7 * TIP_W, TIP_W);
    map_ctx.globalAlpha = 1;
    map_ctx.textAlign = "right";
    map_ctx.fillStyle = "black";
    map_ctx.fillText("TIME " + gameTimer.show(), ((TIP_COUNT_W - 0.1) * TIP_W) + 2, TIP_W + 3, 500);
    map_ctx.fillStyle = "white";
    map_ctx.fillText("TIME " + gameTimer.show(), ((TIP_COUNT_W - 0.1) * TIP_W), TIP_W, 500);

    // ステージクリアした時に表示
    if (stageClear) {
      map_ctx.globalAlpha = 0.7;
      map_ctx.fillStyle = "gray";
      map_ctx.beginPath();
      map_ctx.fillRect(4 * 32, 6 * 32, 12 * 32, 3 * 32);
      map_ctx.globalAlpha = 1;
        map_ctx.textAlign = "center";
        map_ctx.fillStyle = "blue";
        map_ctx.fillText("STAGE " + stageNum, centerX + 2, ((TIP_COUNT_H - 1) * TIP_W) / 2 + 3, 500);
        map_ctx.fillText("CLEAR!", centerX + 2, ((TIP_COUNT_H + 2) * TIP_W) / 2 + 3, 500);
        map_ctx.fillStyle = "white";
        map_ctx.fillText("STAGE " + stageNum, centerX, ((TIP_COUNT_H - 1) * TIP_W) / 2, 500);
        map_ctx.fillText("CLEAR!", centerX, ((TIP_COUNT_H + 2) * TIP_W) / 2, 500);
    }
    // 残り時間をバーで表示
    // 残り時間によってバーの色が変化
    leftTimeParam = (gameTimer.show() / limitTime) * (TIP_COUNT_W * TIP_W);
    map_ctx.globalAlpha = 0.7;
    if (gameTimer.show() >= (limitTime * 0.5)) {
        map_ctx.fillStyle = "green";
    } else if(gameTimer.show() < (limitTime * 0.5) && gameTimer.show() >= (limitTime * 0.3) ){
        map_ctx.fillStyle = "yellow";
    }else{
      map_ctx.fillStyle = "red";
    }
    map_ctx.beginPath();
    map_ctx.fillRect(0, (TIP_COUNT_H - 1) * TIP_W, leftTimeParam, TIP_W);
    map_ctx.globalAlpha = 1;
}

// デバッグ用としてマップのコストを表示
function drawTipCost() {
    map_ctx.font = "10px Arial";
    map_ctx.fillStyle = "white";
    for (var y = 0; y < TIP_COUNT_H; y++) {
        for (var x = 0; x < TIP_COUNT_W; x++) {
            map_ctx.fillText(maps[y][x].cost, x * TIP_W + (TIP_W / 2), y * TIP_W + (TIP_W / 2), 500);
        }
    }
}
