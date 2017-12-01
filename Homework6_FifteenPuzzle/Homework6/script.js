/**
 * Created by Lenovo on 2017/11/6.
 */
var image = document.getElementById("image");
var time = document.getElementById("time_s");
var file = document.getElementById("file_up");
var start_btn = document.getElementById("start");
var pause_btn = document.getElementById("pause");
var result = document.getElementById("result");
var upload_btn = document.getElementById("update");
var blank_p = document.getElementsByClassName("blank");
var interval = [], sort_arr = [];
var start_flag = false, pause_flag = false, k=0;
var sec = "00", min = "00", hour = "00";

//Initialize the image
function setImage(){
	for(var i=0;i<16;i++){
		var piece = document.createElement("div");
		if(i<15) piece.className = "piece_i";
		else piece.className = "blank";
		piece.id = "_piece_" + i;
		piece.addEventListener("click", img_move);
		image.appendChild(piece);
	}
}

function warn_or_tip(mess, type){
	if(type==="t") {
		result.innerText = mess;
		result.className = "tip";
	}
	else {
		result.innerText = "Please " + mess+ " the game first!!";
		result.className = "warning";
	}
}

function time_adder(){
	var sec_num = parseInt(sec), min_num = parseInt(min), hour_num = parseInt(hour);
	sec_num += 1;
	while(sec_num>=60){
		min_num += 1;
		sec_num -= 60;
	}while(min_num>=60){
		hour_num += 1;
		min_num -= 60;
	}if(hour_num>=24){
		start_flag = false;
		result.innerText = "Sorry, you have use to much time....Game Over!";
	}
	if(sec_num<10) sec = '0' + sec_num.toString();
	else sec = sec_num.toString();
	if(min_num<10) min = '0' + min_num.toString();
	else min = min_num.toString();
	if(hour_num<10) hour = '0' + hour_num.toString();
	else hour = shour_num.toString();
	time.value = hour + ":" + min + ":" + sec;
}

function start_game(){
	if(pause_flag) {
		warn_or_tip("continue", "w");
		return;
	}
	hour = min = sec = "00";
	time.value = hour + ":" + min + ":" + sec;
	start_btn.innerHTML = "Restart";
	clear();
	interval[++k] = setInterval(time_adder, 1000);
	start_flag = true;
	randomlize();
	var blank = blank_p[0];
	blank.id = "_piece_15r";
	setTimeout(function(){
		var blank = blank_p[0];
		blank.id = "_piece_15";
	}, 1000); 
	warn_or_tip("Playing....", "t");
}

function clear(){
	for(var i in interval){
		clearInterval(interval[i]);
		k=0;
	}
}

function pause_game(){
	if(!start_flag&&!pause_flag) {
		warn_or_tip("start", "w");
		return;
	}
	result.className = "tip";
	if(pause_btn.innerText==="Pause Game"){
		start_flag = false;
		pause_flag = true;
		clear();
		result.innerText = "Pausing the game....";
		pause_btn.innerText = "Continue Game";
	}else {
		interval[k++] = setInterval(time_adder, 1000);
		start_flag = true;
		pause_flag = false;
		result.innerText = "Playing....";
		pause_btn.innerText = "Pause Game";
	}
}

//Check whether the randomlize is valid or not
function random_validor(arr){
	var result = 0;
	for(var i=0;i<16;i++){
		for(var j=i+1;j<16;j++)
			if(arr[i]>arr[j]) result++;
	}
	for(var i=0;i<16;i++){
		if(arr[i]===15){
			var col = i%4, row = Math.ceil(i/4);
			result += row + col;
		}
	}
	return result%2===1;
}

function m_sort(a, b){
	return 0.5-Math.random();
}

function randomlize(){
	//Return back when need to randomlize
	var child = image.childNodes;
	for(var i=0;i<16;i++){
		child[i].id = "_piece_" + i;
		sort_arr[i] = i;
	}
	sort_arr.sort(m_sort);
	while(!random_validor(sort_arr)){
		sort_arr.sort(m_sort);
	}
	for(var i=0;i<16;i++){
		if(sort_arr[i]===15) child[i].className = "blank";
		else if(child[i].className==="blank") child[i].className = "piece_i";
		child[i].id = "_piece_" + sort_arr[i];
	}
}

function get_nodeIndex(node){
	var child = image.childNodes;
	for(var i=0;i<16;i++){
		if(child[i]===node) return i;
	}
}

function img_move(){
	var child = image.childNodes;
	if(!start_flag){
		if(pause_flag) warn_or_tip("continue", "w");
		else warn_or_tip("start", "w");
		return;
	}else {
		if(this.id==="_piece_15") return;
		warn_or_tip("Playing....", "t");
		var index = get_nodeIndex(this);
		var index_arr = [index-4, index+4];
		if(index%4!==0) index_arr.push(index-1);
		if(index%4!==3) index_arr.push(index+1);
		for(var i=0;i<index_arr.length;i++){
			if(index_arr[i]>=0&&index_arr[i]<=15){
				if(child[index_arr[i]].id==="_piece_15"){
					if(index%4===3&&index_arr[i]===index+1) return;
					var id = this.id, class_ = this.className;
					this.id = "_piece_15";
					this.className = "blank";
					child[index_arr[i]].id = id;
					child[index_arr[i]].className = class_;
					if(check_back()) game_over();
					else return;
				}
			}
		} 
	}
}

function upload(){
	if(!/image\/\w/.test(file.files[0].type)){
		result.innerText = "Please upload image file instead of others!!";
		result.className = "warning";
		return;
	}
	if(pause_flag){
		pause_flag = false;
		pause_btn.innerText = "Pause Game";
	}
	var reader = new FileReader();
	reader.readAsDataURL(file.files[0]);
	reader.onload = function(e){
	    var child = image.childNodes;
		for(var i=0;i<=15;i++){
			child[i].style.backgroundImage = "url(\'" + e.target.result + "\'";
			child[i].id = "_piece_" + i;
			if(i<15) child[i].className = "piece_i";
			else child[i].className = "blank";
		}
		document.getElementById("pre_image").style.backgroundImage = "url(\'" + e.target.result + "\'";
		result.innerText = "Now please click start button to start game.";
		start_flag = false;
		start_btn.innerText = "Start Game";
		hour = min = sec = "00";
		time.value = hour + ":" + min + ":" + sec;
		clear();
	}
}

//Check whether the game is over
function check_back(){
	var child = image.childNodes;
	for(var i=0;i<16;i++){
		if(child[i].id!=="_piece_"+i) return false;
	}
	return true;
}

function game_over(){
	clear();
	start_flag = pause_flag = false;
	result.className = "win";
	setTimeout(function(){
		alert("Congratulations!You win!\nCost Time: " + time.value + "s");
	}, 300);
	warn_or_tip("Congratulations!!You have completed this jigsaw puzzle!", "t");
}

window.onload = function(){
	setImage();
	start_btn.addEventListener("click", start_game);
	pause_btn.addEventListener("click", pause_game);
	upload_btn.addEventListener("change", upload);
	time.readOnly = true;
}