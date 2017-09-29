var input = document.getElementById("input");

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
        var result = eval(text);
        if(result===Infinity) throw "Error";
        else alert("该运算式的结果是: " + eval(text));
    }catch(error){
        alert("该表达式是非法的!");
        input.value = "";
    }
}