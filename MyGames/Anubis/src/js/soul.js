/**
 * タマシイマネージャー
 */
var soulMoveTurn = true;
var soulST = 10;
var counter = 0;
var breakTime = 5;
function soulManager() {
    // タマシイ移動可能時でかつ
    // タマシイが捕まえられていなければ移動
    if (soulMoveTurn) {
        for (var soul_id = 0; soul_id < SOULS_COUNT; soul_id++) {
            if (souls[soul_id].isAlive) {
                moveSouls(souls[soul_id]);
            }
        }
    }
    // 手に入れたタマシイの数が(SOULS_COUNT - 1)未満の時，
    // タマシイの動作可能フレームをアヌビスの半分にする
    if (get_souls < SOULS_COUNT - 1) {
        soulMoveTurn = !soulMoveTurn;
    } else {
        // そうでない場合は，一定間隔でタマシイの移動速度をあげる
        if (counter < soulST) {
            soulMoveTurn = true;
        } else {
            soulMoveTurn = !soulMoveTurn;
            if (counter > soulST + breakTime) {
                counter = -1;
            }
        }
        counter++;
    }
}


/*---------------------------------
* タマシイ移動関数
----------------------------------*/
function moveSouls(soul) {
    var canMove = true;
    var bestCost = 10;
    var sameCostCell = [];
    var cellId;
    mx = soul.x;
    my = soul.y;
    //　周りのマス(上下左右)の中で
    //　一番危険度が低いマスに移動をする
    for (var neighbor of getNeighbor(maps[soul.y][soul.x])) {
        if (bestCost >= neighbor.cost) {
            sameCostCell.push(neighbor);
        }
        if (bestCost > neighbor.cost) {
            sameCostCell.length = 0;
            sameCostCell.push(neighbor);
            bestCost = neighbor.cost;
        }
    }

    // 同じコストが２つ以上あるのならば，ランダムで選択
    if (sameCostCell.length > 1) {
        cellId = Math.floor(Math.random() * sameCostCell.length);
        mx = sameCostCell[cellId].x;
        my = sameCostCell[cellId].y;
    } else if (sameCostCell.length == 1) {
        mx = sameCostCell[0].x;
        my = sameCostCell[0].y;
    } else {
        mx = soul.x;
        my = soul.y;
    }

    // もしもすでに移動予定セルにタマシイがいた場合は移動しない
    for (var otherSoul of souls) {
        if (otherSoul.isAlive) {
            if (mx == otherSoul.x && my == otherSoul.y) {
                canMove = false;
            }
        }
    }
    if (canMove) {
        soul.x = mx;
        soul.y = my;
    }
}
