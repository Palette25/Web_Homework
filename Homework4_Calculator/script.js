var input = document.getElementById("input");

var temp = document.getElementsByTagName("button");

for(var i=0;i<temp.length;i++) {
    temp[i].addEventListener("click", function(){add(this.id);});
}

function add(temp){
    if(temp==="CE") input.value = "";
    else if(temp==="arrow"){
        var len = input.value.length;
        if(len>0){
            input.value = input.value.substring(0, len-1);
        }
    }else if(temp==="result"){
        getResult(input.value);
    }else{
    	if(input.value===null) input.value = temp;
        else input.value += temp;
    }
}

function getResult(text){
    try{
        for(var i=0;i<text.length;i++){
            if((text[i]>='0'&&text[i]<='9')|| text[i]==='+'
                ||text[i]==='-'|| text[i]==='*'||text[i]==='/'
                ||text[i]==='('||text[i]===')'|| text[i]==='.') continue;
            else throw "Error";
        }
        var result = eval(text);
        if(result!==Infinity||flag===false) alert("该运算式的结果是: " + eval(text));
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
