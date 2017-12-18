/* Created by Palette in 2017/12/04 */

var start_flag = false;
var turn_num = 0;
var order = ['A', 'B', 'C', 'D', 'E'];

window.onload = function(){
    $("#button").hover(function(){}, end_cal);
    $(".apb").click(start_cal);
}

function random_sort(){
    return Math.random()>0.5?-1:1;
}

function send_data(i, turn){
    if(!start_flag) return;
    var r_num = $('#t' + (order[i].charCodeAt()-65));
    if(turn===turn_num){
        r_num.css('opacity', 1);
        r_num.text('...');
    }
    all_disable((order[i].charCodeAt()-65), turn);
    var pp = $.get('/'+turn_num+i, {})
        .done(function(data, status){
            if(!start_flag) pp.abort();
            if(turn===turn_num) {
                console.log(turn + ' ' + turn_num);
                r_num.text(data);
            }
            select_alive((order[i].charCodeAt()-65), turn);
            if(i<4) {
                send_data(i+1, turn);
            }
            else if(turn===turn_num) get_result();
        });
}

function get_random(){
    send_data(0, turn_num);
}

function all_disable(i_, turn){
    if(turn!==turn_num) return;
    for(var i=0;i<=4;i++){
        if(i!==i_) $("#" + i).css('background-color', '#989FCF');
    }
}

function select_alive(i_, turn){
    if(i_>4||turn!==turn_num) return;
    for(var i=0;i<=4;i++){
        if(i!==i_) $("#" + i).css('background-color', 'rgba(48, 63, 159, 1)');
    }
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

function start_cal(){
    if(start_flag) return;
    else start_flag = true;
    turn_num++;
    order.sort(random_sort);
    var r_str = '[';
    for(var i=0;i<=4;i++){
        r_str += order[i];
        if(i!==4) r_str += ', ';
        else r_str += ']';
    }
    $('#r_state').text(r_str);
    get_random();
}

function end_cal(){
    for(var i=0;i<=4;i++){
        $('#t'+i).text('');
        $('#t'+i).css('opacity', 0);
        $("#"+i).css('background-color', 'rgba(48, 63, 159, 1)');
    }
    $("#t5").text('');
    $('#r_state').text('');
    $('#info-bar').css('background-color', '#7E7E7E');
    start_flag = false;
    order = ['A', 'B', 'C', 'D', 'E'];
}