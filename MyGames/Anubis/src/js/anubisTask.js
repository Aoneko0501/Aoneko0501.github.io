/*---------------------------------
* タスク処理関数
----------------------------------*/
function anubisTasks(task_array) {
    this.list = task_array;
    this.idle = false;
}
anubisTasks.prototype.push = function(task) {
    this.list.push(task);
};
anubisTasks.prototype.next = function() {
    if (this.list.length == 0) {
        this.idle = true;
        return;
    }
    this.idle = false;
    var task = this.list.shift();

    var self = this;
    setTimeout(function() {
        task(self);
    }, 1);
};
