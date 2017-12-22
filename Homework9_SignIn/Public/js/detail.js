/* Created by Palette in 2017/12/19 */


window.onload = function(){
    $('#right_up_sign').click(exit);
    $('#warning_de').click(op_change);
}

function exit(){
    $.post('/logout', function(status, data){
        window.location.href = 'http://localhost:8000/';
    });
}

function op_change(){
    $('#warning_de').css('opacity', 0);
    $('#warning_de').css('cursor', 'default');
}