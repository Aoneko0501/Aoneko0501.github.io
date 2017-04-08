var changeBGM = false;
var media = document.getElementById("titleBGM");
media.volume = 0.3;
$("#start_btn").click(function() {
    media.src = "./src/BGM/game.mp3";
});

function resetBGM() {
    media.src = "./src/BGM/title.mp3";
    changeBGM = false;
}

function onoffBGM(){
  if(!media.muted){
    media.muted = true;
    onoff.innerText = "BGM OFF";
  }else{
    media.muted = false;
    onoff.innerText = "BGM ON";
  }
}

setInterval(function() {
    if (!changeBGM) {
        if (isGameOver) {
            console.log("changeBGM");
            media.src = "./src/BGM/gameOver.mp3";
            changeBGM = true;
        } else if (isGameClear) {
            console.log("changeBGM");
            media.src = "./src/BGM/gameClear.mp3";
            changeBGM = true;
        }
    }
}, 1000 / 60);
