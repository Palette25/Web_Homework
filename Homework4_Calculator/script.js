var input = document.getElementById("input");
var Result = document.getElementById("showResult");
var temp = document.getElementsByTagName("button");
var get_flag = false;
input.addEventListener("keydown", function(){Enter();});

for(var i=0;i<temp.length;i++) {
    temp[i].addEventListener("click", function(){add(this.id);});
}

function add(temp){
    if(temp==="CE") {
        input.value = "";
        Result.innerText = "";
    }
    else if(temp==="arrow"){
        var len = input.value.length;
        if(len>0){
            input.value = input.value.substring(0, len-1);
        }
    }else if(temp==="result"){
        getResult(input.value);
    }else{
    	if(input.value===null) input.value = temp;
        else if(get_flag===true){
             get_flag = false;
            if(temp>="0"&&temp<="9") {
                input.value = temp;
            }
            else input.value += temp;
        }
        else input.value += temp;
    }
}

function getResult(text){
    try{
        if(multi_divide(text)) throw "Error";
        for(var i=0;i<text.length;i++){
            if((text[i]>='0'&&text[i]<='9')|| text[i]==='+'
                ||text[i]==='-'|| text[i]==='*'||text[i]==='/'
                ||text[i]==='('||text[i]===')'|| text[i]==='.') continue;
            else throw "Error";
        }
        var result = eval(text);
        if(result!==Infinity&&!isNaN(result)) {
            input.value = result;
            get_flag = true;
        }
        else throw "Error";
    }catch(error){
        alert("该表达式是非法的!");
        input.value = "";
    }
}

function Enter() {
    if(window.event.keyCode===13){
        var text = input.value;
        getResult(text);
    }
}

function multi_divide(text){
    for(var i=0;i<text.length-1;i++){
        if(text[i]=='/'&&(text[i+1]=='/'||text[i+1]=='*')) return true;
    }
    return false;
}