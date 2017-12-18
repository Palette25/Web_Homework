/* Created by Palette in 2017/12/04 */

var start_flag = false;
var turn_num = 0, is_alive = [1, 1, 1, 1, 1];

window.onload = function(){
    $("#button").hover(function(){}, end_cal);
    $(".apb").click(start_cal);
}

function send_data(i, turn){
    if(!start_flag) return;
    var r_num = $('#t' + i);
    if(turn===turn_num){
        r_num.css('opacity', 1);
        r_num.text('...');
    }
    all_disable(i, turn);
    var pp = $.get('/'+turn_num, {})
        .done(function(data, status){
            if(!start_flag) pp.abort();
            if(turn===turn_num) r_num.text(data);
            else r_num.text('...');
            select_alive(turn);
            if(turn===turn_num) $('#'+i).css('background-color', '#989FCF');
            if(i<4) {
                down_hide(i);
                send_data(i+1, turn);
            }
            else if(turn===turn_num) get_result();
        });
}

function get_random(){
    send_data(0, turn_num);
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

function all_disable(i_, turn){
    if(turn!=turn_num) return;
    for(var i=i_+1;i<is_alive.length;i++){
        $("#" + i).css('background-color', '#989FCF');
    }
}

function select_alive(turn){
    if(turn!=turn_num) return;
    for(var i=0;i<=4;i++){
        if($('#t' + i).text()==='') {
            $("#" + i).css('background-color', 'rgba(48, 63, 159, 1)');
        }
    }
}

function start_cal(){
    if(start_flag) return;
    else start_flag = true;
    get_random();
}

function end_cal(){
    turn_num++;
    for(var i=0;i<=4;i++){
        $('#t'+i).text('');
        $('#t'+i).css('opacity', 0);
        $("#"+i).css('background-color', 'rgba(48, 63, 159, 1)');
    }
    $("#t5").text('');
    $('#info-bar').css('background-color', '#7E7E7E');
    start_flag = false;
}

function down_hide(i){
    for(var j=i+1;j<=4;j++){
        $('#t'+j).css('opacity', 0);
        $('#t'+j).text('');
    }
}