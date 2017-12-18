/* Created by Palette in 2017/12/04 */
var start_flag = false;
var turn_num = 0;

window.onload = function(){
    $("#button").hover(function(){}, end_cal);
    $(".apb").click(start_cal);
}

function send_data(i, turn){
    if(!start_flag) return;
    $.get('/'+turn_num+i, {})
        .done(function(data, status){
            if(!start_flag) pp.abort();
            if(turn===turn_num) $('#t'+i).text(data);
            else {
                $('#t'+i).text('...');
            }
            $('#'+i).css('background-color', '#989FCF');
            get_result(turn);
        });
}

function get_random(){
    for(var i=0;i<=4;i++){
        $('#t'+i).css('opacity', 1);
        $('#t'+i).text('...');
    }
    for(var i=0;i<=4;i++){
        send_data(i, turn_num);
    }
}

function get_result(turn){
    if(turn!==turn_num) return;
    for(var i=0;i<=4;i++){
        if($('#t'+i).text()==='...') return;
    }
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
    get_random();
}

function end_cal(){
    for(var i=0;i<=4;i++){
        $('#t'+i).text('');
        $('#t'+i).css('opacity', 0);
        $("#"+i).css('background-color', 'rgba(48, 63, 159, 1)');
    }
    $("#t5").text('');
    $('#info-bar').css('background-color', '#7E7E7E');
    start_flag = false;
}