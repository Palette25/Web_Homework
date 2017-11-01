/**
 * Created by Lenovo on 2017/10/21.
 */
var cav = document.getElementById("cav");
var cxt = cav.getContext("2d");
var mess = document.getElementById("tip");
var start_flag = false, win_flag = false, out_flag = false;

cav.addEventListener("mousemove", mouse_check);
cav.addEventListener("mouseout", outTheCav);
cav.height = 300;
cav.width = 500;

function set_tip(mes){
    mes = mes || ' ';
    mess.innerText = mes;
}

function drawup(color){
    if(!color) color = "#EDEDED";
    cxt.beginPath();
    cxt.moveTo(0, 0);
    cxt.lineTo(0, 200);
    cxt.lineTo(150, 200);
    cxt.lineTo(150, 80);
    cxt.lineTo(350, 80);
    cxt.lineTo(350, 200);
    cxt.lineTo(500, 200);
    cxt.lineTo(500, 0);
    cxt.closePath();
    cxt.fillStyle = color;
    cxt.fill();
    cxt.stroke();
}

function drawdown(color){
    if(!color) color = "#EDEDED";
    cxt.beginPath();
    cxt.moveTo(0, 300);
    cxt.lineTo(0, 250);
    cxt.lineTo(200, 250);
    cxt.lineTo(200, 130);
    cxt.lineTo(300, 130);
    cxt.lineTo(300, 250);
    cxt.lineTo(500, 250);
    cxt.lineTo(500, 300);
    cxt.closePath();
    cxt.fillStyle = color;
    cxt.fill();
    cxt.stroke();
}

function drawLine(){
    drawup();
    drawdown();
}

function drawsquare(){
	cxt.beginPath();
	cxt.moveTo(0, 205);
	cxt.lineTo(0, 245);
	cxt.lineTo(40, 245);
	cxt.lineTo(40, 205);
	cxt.closePath();
	cxt.fillStyle = "#83FF79";
	cxt.fill();
	cxt.font = "bold 30px Arial";
	cxt.fillStyle = "#000000";
	cxt.fillText("S", 10, 235);
	cxt.stroke();
	cxt.beginPath();
	cxt.moveTo(500, 205);
	cxt.lineTo(500, 245);
	cxt.lineTo(460, 245);
	cxt.lineTo(460, 205);
	cxt.closePath();
	cxt.fillStyle = "#807BFC";
	cxt.fill();
	cxt.font = "bold 30px Arial";
	cxt.fillStyle = "#000000";
	cxt.fillText("E", 470, 235);
	cxt.stroke();
}

function intialize(){
	drawLine();
	drawsquare();
}

function onUpState(x, y){
    if(x>=0&&x<=150){
        if(y>=0&&y<=200) return true;
    }else if(x>150&&x<=350){
        if(y>=0&&y<=80) return true;
    }else if(x>350&&x<=500){
        if(y>=0&&y<=200) return true;
    }
    return false;
}

function onDownState(x, y){
    if(y>=250&&y<=300){
        if(x>=0&&x<=500) return true;
    }else if(y>=130&&y<=250){
        if(x>=200&&x<=300) return true;
    }
    return false;
}

function outTheCav(){
    drawup();
    drawdown();
    out_flag = true;
    if(!win_flag||!out_flag) set_tip();
}

function onStartState(x, y){
    if(x>=0&&x<=40){
        if(y>=205&&y<=245) return true;
    }
    return false;
}

function onEndState(x, y){
    if(x>=460&&x<=500){
        if(y>=205&&y<=245) return true;
    }
    return false;
}

function mouse_check(e){
    e = e || window.event;
    var mouse_x = e.pageX || (e.clientX + document.documentElement.scrollLeft || document.body.scrollLeft);
    var mouse_y = e.pageY || (e.clientY + document.documentElement.scrollTop || document.body.scrollTop);
    mouse_x -= cav.getBoundingClientRect().x;
    mouse_y -= cav.getBoundingClientRect().y;
    if (onStartState(mouse_x, mouse_y)) {
        start_flag = true;
        out_flag = win_flag = false;
        set_tip("Now you have started this game, have fun.");
    }
    if(start_flag&&!win_flag) {
        if (onUpState(mouse_x, mouse_y)&&!out_flag) {
            drawup("#EA313D");
            set_tip("Oops!You have crashed the upside wall!");
            start_flag = false;
        } else if (onDownState(mouse_x, mouse_y)&&!out_flag) {
            drawdown("#EA313D");
            set_tip("Oops!You have crashed the downside wall!");
            start_flag = false;
        } else if (onEndState(mouse_x, mouse_y)) {
            if(out_flag) set_tip("Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!");
            else set_tip("Congratulations!You win this game!");
            win_flag = true;
        }
    }
    else {
        if(!onUpState(mouse_x, mouse_y)&&!onDownState(mouse_x, mouse_y)&&!win_flag) {
            set_tip("Please go to the start point to start playing!!!");
            drawup();
            drawdown();
        }
        if(onEndState(mouse_x, mouse_y)&&!win_flag){
            set_tip("Don't cheat!!!Please go back to the start point to restart this game!");
            win_flag = true;
        }
    }
}

window.onload = function () {
    intialize();
}