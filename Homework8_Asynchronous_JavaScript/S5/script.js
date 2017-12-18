/* Created by Palette in 2017/12/04 */

async function start_cal(){
    turn_num++;
    var order = ['a', 'b', 'c', 'd', 'e'];
    order.sort(random_sort);
    if($('.apb').css('background-color')==="rgb(152, 159, 207)") return;
    $('.apb').css('background-color', '#989FCF');
    $('#r_state').children().remove();
    $('#r_state').css('opacity', 1);
    var result = 0, result_;
    var r_str = '[';
    for(var i=0;i<=4;i++){
        $('#t'+i).css('opacity', 0);
        r_str += order[i];
        if(i!==4) r_str += ', ';
        else r_str += ']';
    }
    var k = 0;
    $('#t5').text(r_str);
    var now = turn_num;
    for(var i=0;i<=4;i++, k++){
        result_ = await window[order[i]+'Handler'](result, now);
        if(result_===undefined) continue;
        if(result_.length>1) {
            handlerError(result_, now);
        }
        result = result_[0];
    }
    if(k===5) {
        result_ = await bubbleHandler(result, now);
        if(result_!==undefined&&result_.length>1) handlerError(result_, now);
    }
}
    
function end_cal(){
    turn_num++;
    $('#r_state').children().remove();
    order = ['a', 'b', 'c', 'd', 'e'];
    for(var i=0;i<=4;i++){
        $('#t'+i).text('');
        $('#t'+i).css('opacity', 0);
        $("#"+i).css('background-color', 'rgba(48, 63, 159, 1)');
    }
    $("#t5").text('');
    $('#r_state').css('opacity', 0);
    $('.apb').css('background-color', 'rgba(48, 63, 159, 1)');
}

window.onload = function(){
    $("#button").hover(function(){}, end_cal);
    $(".apb").click(start_cal);
}

function random_sort(){
    return Math.random()>0.5?-1:1;
}

async function get_data(i){
    var result = 0;
    await $.get('/'+i+turn_num, {})
        .done(function(data, status){
            result += parseInt(data);
    });
    return result;
}

function get_result(){
    var result = 0;
    for(var i=0;i<=4;i++){
        if($('#t'+i).text()==='') return;
        result += parseInt($('#t'+i).text());
    }
    $('#t5').text(result);
    $('#info-bar').css('background-color', '#989FCF');
}

function handlerError(err, turn){
    if(turn!==turn_num) return;
    console.log(err);
    var mess = err[1], num = err[0];
    $('#r_state').append('<p>'+ mess + '  ' + num + '</p>'); 
}

function random_err(){
    return Math.random()>0.7;
}

async function aHandler(currentNum, turn){
    if(turn!==turn_num) return;
    var err_flag = random_err(), r_id = Math.floor(Math.random()*100);
    var result = currentNum;
    $('#t0').css('opacity', 1);
    $('#t0').text('...');
    await get_data(r_id).then((result_) => result += result_);
    if(turn!==turn_num) return;
    $('#t0').text(result-currentNum);
    if(err_flag){
        var mess = '这不是个天大的秘密';
        return [result, mess];
    }else {
        $('#r_state').append('<p> 这是一个天大的秘密 </p>');
        return [result];
    }
}

async function bHandler(currentNum, turn){
    if(turn!==turn_num) return;
    var err_flag = random_err(), r_id = Math.floor(Math.random()*100);
    var result = currentNum;
    $('#t1').css('opacity', 1);
    $('#t1').text('...');
    await get_data(r_id).then((result_) => result += result_);
    if(turn!==turn_num) return;
    $('#t1').text(result-currentNum);
    if(err_flag){
        var mess = '我知道';
        return [result, mess];
    }else {
        $('#r_state').append('<p> 我不知道 </p>');
        return [result];
    }
}
var turn_num = 0;
async function cHandler(currentNum, turn){
    if(turn!==turn_num) return;
    var err_flag = random_err(), r_id = Math.floor(Math.random()*100);
    var result = currentNum;
    $('#t2').css('opacity', 1);
    $('#t2').text('...');
    await get_data(r_id).then((result_) => result += result_);
    if(turn!==turn_num) return;
    $('#t2').text(result-currentNum);
    if(err_flag){
        var mess = '你知道';
        return [result, mess];
    }else {
        $('#r_state').append('<p> 你不知道 </p>');
        return [result];
    }
}

async function dHandler(currentNum, turn){
    if(turn!==turn_num) return;
    var err_flag = random_err(), r_id = Math.floor(Math.random()*100);
    var result = currentNum;
    $('#t3').css('opacity', 1);
    $('#t3').text('...');
    await get_data(r_id).then((result_) => result += result_);
    if(turn!==turn_num) return;
    $('#t3').text(result-currentNum);
    if(err_flag){
        var mess = '他知道';
        return [result, mess];
    }else {
        $('#r_state').append('<p> 他不知道 </p>');
        return [result];
    }
}

async function eHandler(currentNum, turn){
    if(turn!==turn_num) return;
    var err_flag = random_err(), r_id = Math.floor(Math.random()*100);
    var result = currentNum;
    $('#t4').css('opacity', 1);
    $('#t4').text('...');
    await get_data(r_id).then((result_) => result += result_);
    if(turn!==turn_num) return;
    $('#t4').text(result-currentNum);
    if(err_flag){
        var mess = '是的是的';
        return [result, mess];
    }else {
        $('#r_state').append('<p> 才怪 </p>');
        return [result];
    }
}

async function bubbleHandler(currentNum, turn){
    if(turn!==turn_num) return;
    var err_flag = random_err(), r_id = Math.floor(Math.random()*100);
    if(err_flag){
        var mess = '楼主异步调用战斗力嗨强，目测超过';
        return [currentNum, mess];
    }else {
        $('#r_state').append('<p> 楼主异步调用战斗力感人，目测不超过' + currentNum + ' </p>');
        var result = currentNum;
        await get_data(r_id).then((result_) => result += result_);
        return [result];
    }
}
