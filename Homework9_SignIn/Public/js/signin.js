/* Created by Palette in 2017/12/19 */

window.onload = function(){
    $('#left_up_sign').click(back);
    $('#reset').click(reset);
    $('#signin').click(check_signin_valid);
    $('#name').bind("input propertychange change", clear_error_mess);
    $('#pass').bind("input propertychange change", clear_error_mess);
}

function back(){
    window.location.href = "http://localhost:8000/regist";
}

function reset(){
    $("#warning").children().remove();
    $("#warning").css('opacity', 0);
    $('#name').val("");
    $('#pass').val("");
}

function check_signin_valid(){
    var name_ = $('#name').val(), pass_ = $('#pass').val();
    var error_flag = "", r_flag = false;
    $.post('/', {'name': name_, 'pass': pass_})
    .done(
        function(data, status){
            error_flag = data;
            console.log(data);
            //State 0 represents that User no exist, state 1 represents that password error
            if(error_flag=="0"){
                $("#warning").children().remove();
                $("#warning").append("<p id='msg'>登录失败!!<br/><br/>用户不存在!<br/><br/></p>\n");
                $("#warning").css('opacity', 1);
            }else if(error_flag=="1"){
                $("#warning").children().remove();
                $("#warning").append("<p id='msg'>登录失败!!<br/><br/>登录密码错误!<br/><br/></p>\n");
                $("#warning").css('opacity', 1);
            }else if(error_flag=="2"){
                window.location.href = 'http://localhost:8000/?username='+name_;
            }
        }
    )
}

function clear_error_mess(){
    $("#warning").children().remove();
    $("#warning").css('opacity', 0);
}