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

//Start game
function start_game(){
	time.value = 0;
	start_btn.innerHTML = "Restart";
	clear();
	interval[++k] = setInterval("time.value++;", 1000);
	start_flag = true;
	randomlize();
	var blank = blank_p[0];
	blank.id = "_piece_15r";
	setTimeout(function(){
		var blank = blank_p[0];
		blank.id = "_piece_15";
	}, 1000); 
	result.className = "tip";
	result.innerText = "Playing....";
}

function clear(){
	for(var i in interval){
		clearInterval(interval[i]);
		k=0;
	}
}

function pause_game(){
	if(!start_flag&&!pause_flag) {
		result.innerText = "Please start the game first!!";
		result.className = "warning";
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
		interval[k++] = setInterval("time.value++;", 1000);
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
		if(pause_flag) result.innerText = "Please continue the game first!!";
		else result.innerText = "Please start the game first!!";
		result.className = "warning";
		return;
	}else {
		if(this.id==="_piece_15") return;
		result.className = "tip";
		result.innerText = "Playing....";
		var index = get_nodeIndex(this);
		var index_arr = [index-4, index-1, index+1, index+4];
		for(var i=0;i<4;i++){
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
		time.value = 0;
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
	result.innerText = "Congratulations!!You have completed this jigsaw puzzle!"
	start_btn.className = "back";
	result.className = "tip";
}

window.onload = function(){
	setImage();
	start_btn.addEventListener("click", start_game);
	pause_btn.addEventListener("click", pause_game);
	upload_btn.addEventListener("change", upload);
	time.readOnly = true;
}