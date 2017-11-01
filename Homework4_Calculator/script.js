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
        var font_zero = text[0]==='0'?true:false;
        if(multi_divide(text)) throw "Error";
        for(var i=0;i<text.length;i++){
            if((text[i]>='0'&&text[i]<='9')|| isOperator(text[i]) || text[i]==='.') {
                if(text[i]==='0'&&font_zero===true) {
                    text = text.substr(0, i) + text.substr(i+1, text.length);
                    i--;
                }
                else if(text[i]!=='0') {
                    if(isOperator(text[i])) font_zero = true;
                    else font_zero = false;
                }
            }
            else throw "Error";
        }
        var result = eval(text);
        if(result!==Infinity&&!isNaN(result)) {
            result = result.toFixed(13);
            var l_result = parseFloat(result.toString());
            input.value = l_result;
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

function isOperator(text){
    if(text==='+'||text==='-'|| text==='*'
        ||text==='/'||text==='('||text===')') return true;
    else return false;
}