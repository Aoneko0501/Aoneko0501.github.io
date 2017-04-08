// 変数の初期化
var maps; // ステージデータ
var maptips; // マップチップデータ
var map_ctx; // マップ用コンテキスト
var player = {}; // プレイヤーの情報管理(オブジェクト生成)
var souls = []; // タマシイたちのオブジェクト群
var get_souls; // 現在いくつタマシイを手に入れたか
var anubisIsMove = false;
var anubisStart = false;
var stageNum = 1;
var stageClear = false;
var limitTime = 90; // 制限時間
var SOULS_COUNT;
var isGameOver = false;
var isGameClear = false;

// デバッグ用変数
// マップの危険度を可視化するかどうか
var canSeeParameter = false;

// マップデータと画像番号の対応
var MAP_CHARS = {
    " ": 0, // 床
    "#": 1, // 壁
    "S": 0, // タマシイ
    "@": 0 // アヌビス
};

var TIP_W = 32; // マップチップの１コマのサイズ
var TIP_COUNT_W = 20; // 横にチップを並べる数
var TIP_COUNT_H = 15; // 縦にチップを並べる数
var map_canvas_x, map_canvas_y = 0;
var anime_index = 0;

/*---------------------------------
* javascriptの初期化
----------------------------------*/
$(document).ready(function() {
    initCanvas();
    // 初期表示画面
    showPage("#title-page");
    $("#start_btn").click(function() {
        initCanvas();
        initGame();
    });
});

$(function() {
    $("#restart_btn").click(function() {
        restart();
        resetBGM();
    });
    $("#restart_btn2").click(function() {
        restart();
        resetBGM();
    });
});

function restart() {
    console.log("Click!");
    showPage("#title-page");
    isGameOver = false;
    isGameClear = false;
}
/*---------------------------------
* 指定したページを表示
----------------------------------*/
function showPage(pagename) {
    $("[data-role=page]").hide();
    $(pagename).fadeIn("slow");
}

/*---------------------------------
* キャンバスの初期化
----------------------------------*/
var init_event = false;

function initCanvas() {
    // Canvasで絶対座標を指定
    var doc_w = $(document).width();
    map_canvas_x = Math.floor((doc_w - 640) / 2);
    $("#map_canvas").attr({
        "width": "640px",
        "height": "480px"
    });
    $("#map_canvas").css({
        "position": "absolute",
        "left": map_canvas_x,
        "top": 0
    });
    if (init_event == false) {
        // 描画用コンテキストを取得
        map_ctx = $("#map_canvas")[0].getContext("2d");
        // キー操作の設定
        // ---PC向け
        $("#map_canvas").mousedown(canvas_mousedown);
        $("#map_canvas").mousemove(canvas_mousemove);
        $("#map_canvas").mouseup(canvas_mouseup);
        //$(document).keydown(document_keydown);
        //$(document).keyup(document_keyup);
        // ---スマートフォン向け
        $("#map_canvas")
            .bind("touchstart", canvas_touchstart)
            .bind("touchmove", canvas_touchmove)
            .bind("touchend", canvas_touchend);

        init_event = true;
    }
}

/*---------------------------------
* ゲーム情報の初期化
----------------------------------*/
function initGame() {
    showPage("#game-page");
    // 非同期のタスクを数珠つなぎに実行する
    var tasks = new anubisTasks([
        initGameVars,
        loadMapData,
        loadMapTips,
        gameStart
    ]);
    tasks.next();
}

/*---------------------------------
* 各パラメータの初期化
----------------------------------*/

function initGameVars(tasks) {
    isGameOver = false;
    // ステージの情報を各キャラクターに反映させる
    anubisStart = false;
    // アヌビス
    player.x = 1;
    player.y = 1;
    player.move_x = 0;
    player.move_y = 0;

    // 各マップのセル
    maps = [];
    for (var y = 0; y < TIP_COUNT_H; y++) {
        maps[y] = [];
        for (var x = 0; x < TIP_COUNT_W; x++) {
            maps[y][x] = {};
            maps[y][x].char = null;
            maps[y][x].x = x;
            maps[y][x].y = y;
            maps[y][x].id = TIP_COUNT_H * y + x;
            //console.log(maps[y][x].x);
            maps[y][x].cost = 100.0;
            // セルの近所の情報を格納
            maps[y][x].parent = null;
        }
    }

    //console.log(maps);
    tasks.next();
}

/*---------------------------------
* マップデータ初期化，読み込み
* この時，アヌビスとタマシイの位置情報も取得
----------------------------------*/
function loadMapData(tasks) {
    SOULS_COUNT = 0; // ステージの魂の数
    get_souls = 0;
    $.get("./maps/stage" + stageNum + ".txt", function(txt) {
        var lines = txt.split("\n");
        // 魂の数カウント用
        var soul_id = 0;
        for (var y = 0; y < lines.length; y++) {
            var line = lines[y];
            for (var x = 0; x < line.length; x++) {
                maps[y][x].char = line.substr(x, 1);
                // もしも@ならばアヌビスの位置情報を更新
                if (maps[y][x].char == '@') {
                    player.x = x;
                    player.y = y;
                    //console.log("anubis =" + player.x + "," + player.y);
                }
                // もしもSならばタマシイの位置をセット
                if (maps[y][x].char == 'S') {
                    souls[soul_id] = {};
                    souls[soul_id].x = x;
                    souls[soul_id].y = y;
                    souls[soul_id].move_x = 0;
                    souls[soul_id].move_y = 0;
                    souls[soul_id].isAlive = true;
                    souls[soul_id].id = soul_id;
                    //console.log("soul[" + soul_id + "]=" + souls[soul_id].x + "," + souls[soul_id].y);
                    soul_id++;
                }
                //console.log("maps[" + x + "][" + y + "]=" + maps[y][x].x + "," + maps[y][x].y);
            }
        }
        SOULS_COUNT = soul_id;
        tasks.next();
    });
}

var soulPic;
var playerPic;
var floorPic;
var wallPic;
/*---------------------------------
* マップチップの読み込み
----------------------------------*/
function loadMapTips(tasks) {

    maptips = new Image();
    soulPic = new Image();
    playerPic = new Image();
    floorPic = new Image();
    wallPic = new Image();
    maptips.onload = function() {
        tasks.next();
    }
    maptips.src = "./src/img/maptip.png";
    soulPic.src = "./src/img/soul.png";
    playerPic.src = "./src/img/anubis_01.png";
    floorPic.src = "./src/img/floor2.png";
    wallPic.src = "./src/img/wall.png";
}

/*---------------------------------
* 各マップチップの描画
----------------------------------*/
function drawMap(tasks) {
    for (var y = 0; y < TIP_COUNT_H; y++) {
        for (var x = 0; x < TIP_COUNT_W; x++) {
            if(getMap(x,y) == 0){
            map_ctx.drawImage(
                floorPic,
                0,
                0,
                TIP_W,
                TIP_W,
                x * TIP_W,
                y * TIP_W,
                TIP_W,
                TIP_W
            );
          }else{
            map_ctx.drawImage(
                wallPic,
                0,
                0,
                TIP_W,
                TIP_W,
                x * TIP_W,
                y * TIP_W,
                TIP_W,
                TIP_W
            );
          }
        }
    }
    // タマシイの描画

    for (var soul_id = 0; soul_id < SOULS_COUNT; soul_id++) {
        if (souls[soul_id].isAlive) {
            map_ctx.drawImage(
                soulPic,
                0,
                0,
                TIP_W,
                TIP_W,
                souls[soul_id].x * TIP_W,
                souls[soul_id].y * TIP_W,
                TIP_W,
                TIP_W
            );
        }
    }
    // アヌビス描画

    map_ctx.drawImage(
        playerPic,
        0,
        0,
        TIP_W,
        TIP_W,
        player.x * TIP_W,
        player.y * TIP_W,
        TIP_W,
        TIP_W
    );
    if (canSeeParameter) {
        drawTipCost();
    }
}

/*---------------------------------
* ゲームスタート関数
----------------------------------*/
var game_loop_id = 0;

function gameStart(tasks) {
    tasks.next();
    //　最初に各マップのコストを計算する
    setDistance();
    mainLoop();
    game_loop_id = setInterval(mainLoop, 100);
}

/*---------------------------------
* メインループ
----------------------------------*/
var clearTime;
var gameTimer;

function mainLoop() {
    drawMap();
    if (!anubisStart) {
        // スタート前の処理-------------------------------------
        waitSpaceKey();
        stageClear = false;
        clearTime = 0;
        // 残り時間を90秒に設定
        gameTimer = new Timer(limitTime);
    } else {
        // スタート後の処理------------------------------------
        if (!stageClear) {
            // ステージクリア前の処理++++++++++++++++++++++++
            updateAll();
            movePlayer();
            soulManager();
        } else {
            // ステージクリア後の処理++++++++++++++++++++++++
            clearTime++;
            if (clearTime > 10) {
                gameClear();
            }
        } // ++++++++++++++++++++++++++++++++++++++++++
    }
    // ゲームの状態を表示
    drawParam();
}
/*---------------------------------
* ゲームUpdagte関数
* ・各マップチップの現在の危険度を更新
* ・その他
----------------------------------*/
function updateAll() {
    //console.log(maps);
    // タイマー更新
    gameTimer.update();
    if (gameTimer.show() > gameTimer.limitTime - 1) {
        // 開始1秒間だけSTART!と表示
        drawStart();
    }
    // 時間切れになった時の処理
    if (gameTimer.show() < 0) {
        gameOver();
    }
    // アヌビスが移動したら，距離(コスト)を再計算する．
    if (anubisIsMove) {
        setDistance();
        anubisIsMove = false;
    }
    // 捕まえられていないタマシイの情報を更新する
    for (var soul_id = 0; soul_id < SOULS_COUNT; soul_id++) {
        if (souls[soul_id].isAlive) {
            // アヌビスがタマシイを捕まえた時
            if (souls[soul_id].x == player.x && souls[soul_id].y == player.y) {
                captureSoul();
                souls[soul_id].isAlive = false;
                get_souls++;
            }
        }
    }
    // タマシイを集めきった時，ステージクリアとする
    if (get_souls >= SOULS_COUNT) {
        stageClear = true;
    }
}

// 魂を捕まえた時，音を鳴らす関数
function captureSoul(){
  $('#capture').prop("volume",0.3);
  $('#capture').prop("currentTime",0);
  $('#capture').get(0).play();
}

/* ---------------------------------
 * 指定したセルとアヌビスとの最短距離を返す
 * ダイクストラ法を使用
 ---------------------------------*/
function setDistance() {
    // ダイクストラ法を用いて，アヌビスからの該当セルへの最短経路を算出する．
    var start = maps[player.y][player.x];
    var open = [];
    var close = [];

    // スタートセルをopenリストに追加
    start.cost = 0.0;
    //console.log(start.id);
    open.push(start);

    while (open.length > 0) {
        // openリストから最もコストが少ないセルを取り出す
        var current = open[0];
        if (current.id == undefined) break;
        //console.log(current.id + ",x=" + current.x + ",y=" + current.y);
        //console.log(open);
        open.shift();
        // closeリストに現在のセルを追加
        close.push(current);
        // 各隣接ノードを探索
        for (var neighbor of getNeighbor(current)) {
            //console.log("search");
            if (close.indexOf(neighbor) >= 0) {
                //スタートから現在のコスト+隣接ノードへのエッジの重み < 隣接ノードのコストならば更新
                if (current.cost + 1 < neighbor.cost) {
                    neighbor.cost = current.cost + 1;
                    close.splice(close.indexOf(neighbor), 1);
                    open.push(neighbor);
                }
            }
            // ノードが未探索だった時
            else if (open.indexOf(neighbor) >= 0) {
                if (current.cost + 1 < neighbor.cost) {
                    neighbor.cost = current.cost + 1;
                    open.splice(open.indexOf(neighbor), 1);
                    close.push(neighbor);
                }
            } else {
                neighbor.cost = current.cost + 1;
                open.push(neighbor);
            }
        }
    }

    // マップのコストの最大値と最小値を取得
    var maxCost = null;
    var minCost = null;
    for (var y = 0; y < TIP_COUNT_H; y++) {
        for (var x = 0; x < TIP_COUNT_W; x++) {
            if (maps[y][x].char != "#") {
                if (maxCost == null || maxCost > maps[y][x].cost) maxCost = maps[y][x].cost;
                if (minCost == null || minCost < maps[y][x].cost) minCost = maps[y][x].cost;
            }
        }
    }
    // マップのコストを0.0~1.0に変換
    for (var y = 0; y < TIP_COUNT_H; y++) {
        for (var x = 0; x < TIP_COUNT_W; x++) {
            if (maps[y][x].char != "#") {
                maps[y][x].cost = ((maps[y][x].cost - minCost) / (maxCost - minCost)).toFixed(1);
            }
        }
    }

}

/**
 * このセルの周りのセルを返す
 * @param  {[type]} cell 中心となるマップチップ
 * @return {[type]}      付近のマップチップの集合
 */
function getNeighbor(cell) {
    var neighbors = [];
    var x = Math.floor(cell.x);
    var y = Math.floor(cell.y);
    //console.log(getMap((x-1),y));
    if (getMap((x - 1), y) == 0) {
        neighbors.push(maps[y][(x - 1)]);
        //console.log("x = " + (x - 1) + ",y = " + y + ",mapNo = " + getMap((x - 1), y));
    }
    if (getMap((x + 1), y) == 0) {
        neighbors.push(maps[y][(x + 1)]);
        //console.log("x = " + (x + 1) + ",y = " + y + ",mapNo = " + getMap((x - 1), y));
    }
    if (getMap(x, (y - 1)) == 0) {
        neighbors.push(maps[(y - 1)][x]);
        //console.log("x = " + x + ",y = " + (y - 1) + ",mapNo = " + getMap(x, (y - 1)));
    }
    if (getMap(x, (y + 1)) == 0) {
        neighbors.push(maps[(y + 1)][x]);
        //console.log("x = " + x + ",y = " + (y + 1) + ",mapNo = " + getMap(x, (y + 1)));
    }
    //console.log(neighbors);
    return neighbors;
}

/*---------------------------------
* アヌビス移動関数
----------------------------------*/
var mx = 0,
    my = 0;

function movePlayer() {
    // console.log("player = " + player.move_x + "," + player.move_y);
    if (player.move_x != 0 || player.move_y != 0) {
        mx = player.x + player.move_x;
        my = player.y + player.move_y;
        if (getMap(mx, my) != 1) {
            player.x = mx;
            player.y = my;
            anubisIsMove = true;
        }
    }
}
/*---------------------------------
* マップチップのID取得関数
----------------------------------*/
function getMap(x, y) {
    if (x < 0 || y < 0) return 2;
    if (y >= maps.length) return 2;
    if (x >= maps[y].length) return 2;
    var ch = maps[y][x].char;
    var no = MAP_CHARS[ch];
    return no;
}

/*---------------------------------
* マウスによる処理関数群
----------------------------------*/
var mouse_down = false;

function canvas_mousedown(e) {
    e.preventDefault();
    mouse_down = true;
    checkInput(e);
}

function canvas_mousemove(e) {
    e.preventDefault();
    if (mouse_down) checkInput(e);
}

function canvas_mouseup(e) {
    mouse_down = false;
    player.move_x = 0;
    player.move_y = 0;
}

// マウスが画面のどこをクリックしたか認識する
function checkInput(e) {
    var mx = e.pageX - map_canvas_x;
    var my = e.pageY - map_canvas_y;
    /*
    player.move_x = 0;
    player.move_y = 0;
    var dx = mx - Math.floor(TIP_COUNT_W * TIP_W / 2);
    var dy = my - Math.floor(TIP_COUNT_H * TIP_W / 2);
    if (Math.abs(dx) > Math.abs(dy)) {
        player.move_x = (dx > 0) ? 1 : -1;
        player.move_y = (dy > 0) ? 1 : -1;
    }
    */
    var cellX = Math.floor(mx / TIP_W);
    var cellY = Math.floor(my / TIP_W);

    console.log("click = " + cellX + ", " + cellY);
    console.log("distance from anubis = " + maps[cellY][cellX].cost);
}

/*---------------------------------
* スマホによる処理関数群
----------------------------------*/
// スマホでタップした時
function canvas_touchstart(e) {
    e.preventDefault();
    checkInput(event.changedTouches[0]);
}

function canvas_touchmove(e) {
    e.preventDefault();
    mouse_down = true;
    checkInput(event.changedTouches[0]);
}

function canvas_touchend(e) {
    e.preventDefault();
    checkInput(event.changedTouches[0]);
}

function gameClear() {
    clearInterval(game_loop_id);
    console.log("STAGE" + stageNum + " CLEAR!!!");
    // 次のステージへ
    stageNum++;
    if (stageNum <= 3) {
        initGame();
    } else {
        console.log("GAME CLEAR!!!");
        isGameClear = true;
        stageNum = 1;
        showPage("#gameClear-page");
    }
}

function gameOver() {
    clearInterval(game_loop_id);
    isGameOver = true;
    console.log("GAME OVER...");
    stageNum = 1;
    anubisStart = false;
    showPage("#gameOver-page");
}
