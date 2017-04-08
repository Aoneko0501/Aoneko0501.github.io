// タイマーのクラス
var Timer = (function() {
	"use strict";
	
    // constructor
    var Timer = function(limitTime) {
        this.startTime = new Date();
        this.nowTime = 0;
        this.limitTime = limitTime;
        this.leftTime = limitTime;
    };

    var p = Timer.prototype;

    // 毎秒更新
    p.update = function() {
        this.nowTime = new Date();
        this.leftTime = (this.limitTime - (this.nowTime.getTime() - this.startTime.getTime()) / 1000);
    };

    // 残し時間を表示
    p.show = function(){
      return this.leftTime.toFixed(1);
    };

    return Timer;
})();
