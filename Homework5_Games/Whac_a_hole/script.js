/**
 * Created by Lenovo on 2017/10/23.
 */
var mole = document.getElementById("mole");
var btn = document.getElementById("button");
var mess = document.getElementById("wait_mess");
var score = document.getElementById("score");
var scroll = document.getElementById("scroll_t");
var cxt = scroll.getContext("2d");

scroll.height = 20;
scroll.width = 120;

var radios = new Array();
var time = 30;
var before_score = 0;
var index = -1;

var start_flag = false;
var first_flag = true;
var pause_flag = false;

//Append radios elements to the div
for(var i=0;i<60;i++){
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.className = "radio_ele";
    radio.id = i;
    radio.addEventListener("click", onStateChange);
    mole.appendChild(radio);
    radios[i] = radio;
}

btn.addEventListener("click", start_or_stop);

function start_or_stop(){
    if(start_flag){
        pause_game();
        mess.value = "Waiting to continue...";
        start_flag = false;
    }else {
        mess.value = "Start playing...";
        start_flag = true;
        pause_flag = false;
        start_game();
    }
}

function getRandom(){
    var pre_index = index;
    while(pre_index===index){
        index = Math.floor(Math.random()*60);
    }
    radios[index].checked = true;
}

var draw_width = 120;

function decrease(){
    cxt.font = "bold 12px Verdana";
    if(draw_width===0) gameOver(1);
    else {
        cxt.clearRect(0, 1, 120, 20);
        draw_width -= 1;
        cxt.fillStyle = "#999999";
        time -= 0.25;
        var result = Math.ceil(time);
        if(time<=10) cxt.fillStyle = "#ff0000";
        cxt.fillRect(0, 1, draw_width, 20);
        cxt.fillStyle = "#000000";
        if(time<=10) cxt.fillStyle = "#ff0000";
        cxt.fillText(result + 's', 50, 15);
    }
}

function start_game(){
    score.value = before_score;
    loop = setInterval("decrease()", 250);
    if(first_flag) {
        scroll.width = 120;
        cxt.fillStyle = "#999999";
        cxt.fillRect(0, 1, 120, 20);
        getRandom();
    }
}

function onStateChange(){
    if(pause_flag){
        if(this.id==index) return;
        else this.checked = false;
        return;
    }
    if(!start_flag) {
        this.checked = false;
        alert("Please start the game first!");
        return;
    }
    if(this.id==index){
    	score.value++;
    	getRandom();
    }else {
        if(score.value>0) score.value--;
        else gameOver(0);
    }
    this.checked = false;
}

function pause_game(){
    before_score = score.value;
    clearInterval(loop);
    first_flag = false;
    pause_flag = true;
}

function gameOver(flag){
    mess.value = "Game Over";
    if(flag) alert("Times up!\nGame Over!Your score is " + score.value);
    else alert("Game Over, don't let your score be negative!");
    radios[index].checked = false;
    clearInterval(loop);
    start_flag = false;
    first_flag = true;
    draw_width = 120;
    time = 30;
    before_score = 0;
}
