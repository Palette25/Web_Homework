/* Created by Palette in 2017/12/04 */

var is_alive = [1, 1, 1, 1, 1, 0];
var turn_num = 0;

window.onload = function(){
    $(".button").click(get_random);
    $("#button").hover(start_cal, end_cal);
    $("#info-bar").click(get_result);
}

function get_random(){
    var ID = this.id, btn = $('.button');
    var turn = turn_num;
    if(!is_alive[ID]) return;
    else {
        var r_num = $('#t' + ID);
        r_num.css('opacity', 1);
        r_num.text('...');
        all_disable(parseInt(ID), turn);
        var pp = $.post('/', {})
            .done(
                function(data, status){
                    if(turn!==turn_num) pp.abort();
                    else r_num.text(data);
                    select_alive(parseInt(ID), turn);
            });
    }
}

function get_result(){
    if(is_alive[5]===0) return;
    else {
        var result = 0;
        for(var i=0;i<=4;i++){
            result += parseInt($('#t'+i).text());
        }
        $('#t5').text(result);
        $('#info-bar').css('background-color', '#989FCF');
        is_alive[5] = 0;
    }
}

function all_disable(id, turn){
    if(turn!==turn_num) return;
    for(var i=0;i<is_alive.length;i++){
        is_alive[i] = 0;
        if(i!==id) {
            $("#" + i).css('background-color', '#989FCF');
        }
    }
}

function select_alive(id, turn){
    if(turn!==turn_num) return;
    var btn = $(".button"), total = 0;
    $("#" + id).css('background-color', '#989FCF');
    for(var i=0;i<btn.length;i++){
        if($('#t' + i).text()==='') {
            is_alive[i] = 1;
            if(i!==id) $("#" + i).css('background-color', 'rgba(48, 63, 159, 1)');
        }
        else total += 1;
    }
    if(total===5) {
        $('#info-bar').css('background-color', '#989FCF');
        is_alive[5] = 1;
    }
}

function start_cal(){
    turn_num++;
    console.log('Start calculating....');
}

function end_cal(){
    turn_num++;
    is_alive = [1, 1, 1, 1, 1, 0];
    for(var i=0;i<=4;i++){
        $('#t'+i).text('');
        $('#t'+i).css('opacity', 0);
        $("#"+i).css('background-color', 'rgba(48, 63, 159, 1)');
    }
    $("#t5").text('');
    $('#info-bar').css('background-color', '#7E7E7E');
}