/* Created by Palette in 2017/11/26 */

//Regular Expressions
var username = /^[a-zA-Z][a-zA-z0-9\_]{5,17}/, id = /[1-9][0-9]{7}/, phone = /[1-9][0-9]{10}/;
var mail = /^[a-zA-Z0-9\_\-]+@(([a-zA-Z0-9\_\-])+\.)+[a-zA-Z]{2,4}$/;

window.onload = function(){
    $('#reset').click(reset);
    $('#submit').click(check_submit_valid);
    $('#re_index').click(function(){
        window.location.href = "http://127.0.0.1:8000";
    });
    set_focus_text($('#name'), 'name', "用户名6~18位英文字母、数字或下划线，必须以英文字母开头");
    set_focus_text($('#id'), 'id', "学号8位数字，不能以0开头");
    set_focus_text($('#phone'), 'phone', "电话11位数字，不能以0开头");
    set_focus_text($('#mail'), 'mail', "邮箱形式错误");
}

//Reset the input frames
function reset(){
    $("#warning").children().remove();
    $("#warning").css('opacity', 0);
    $('#name').val("");
    $('#id').val("");
    $('#phone').val("");
    $('#mail').val("");
    $('p').text("");
}

function test_pattern(){
    var result = [];
    var name_ = $('#name').val(), id_ = $('#id').val(), phone_ = $('#phone').val(), mail_ = $('#mail').val();
    if(!username.test(name_)) result.push('用户名');
    if(!id.test(id_)) result.push('学号');
    if(!phone.test(phone_)) result.push('电话号码');
    if(!mail.test(mail_)) result.push('邮箱');
    return result;
}

//Check if the submit message is valid
function check_submit_valid(){
    var name_ = $('#name').val(), id_ = $('#id').val(), phone_ = $('#phone').val(), mail_ = $('#mail').val();
    var pattern_arr = test_pattern(), len = pattern_arr.length, p_flag = len===0?0:1;
    var repeat_arr = "", r_flag = false;
    $.post('/', {'name': name_, 'id': id_, 'phone': phone_, 'mail': mail_, 'flag': p_flag})
        .done(
            function(status, data){
                var msg = "注册失败!!<br/><br/>";
                if(p_flag){
                    for(var i=0;i<len;i++){
                        msg += pattern_arr[i] + '格式错误!<br/><br/>';
                    }
                    $("#warning").children().remove();
                    $("#warning").append("<p id='msg'>" + msg + "</p>\n");
                    $("#warning").css('opacity', 1);
                }else{
                    $("#warning").children().remove();
                    $("#warning").append("<p id='msg'>" + msg + "</p>\n");
                    $("#warning").css('opacity', 1);
                    window.location.href = "http://127.0.0.1:8000/?username=" + name_;
                }
            }
        )
        .fail(
        function(data, status){
            repeat_arr = data.responseText;
            console.log(data.responseText);
            var buffer = "";
            var msg = "注册失败!!<br/><br/>";
            if(p_flag){
                for(var i=0;i<len;i++){
                    msg += pattern_arr[i] + '格式错误!<br/><br/>';
                }
                $("#warning").children().remove();
                $("#warning").append("<p id='msg'>" + msg + "</p>\n");
                $("#warning").css('opacity', 1);
            }else{
            for(var i=0;i<repeat_arr.length;i++){
                console.log(repeat_arr.length);
                switch(repeat_arr[i]){
                    case '1': buffer = "用户名";break;
                    case '2': buffer = "学号";break;
                    case '3': buffer = "电话号码";break;
                    default: buffer = "邮箱";
                }
                msg += buffer + "与已注册用户冲突!<br/><br/>";
                buffer = "";
            }
        }
            $("#warning").children().remove();
            $("#warning").css('opacity', 1);
            $("#warning").append("<p id='msg'>" + msg + "</p>\n");
        });
}
//Check whether the editing messages is valid or not
function validator(value, name){
    switch(name){
        case 'name':
            if(username.test(value)) return true;
            else return false;
        case 'id':
            if(id.test(value)) return true;
            else return false;
        case 'phone':
            if(phone.test(value)) return true;
            else return false;
        default:
            if(mail.test(value)) return true;
            else return false;
    }
}

function set_focus_text(partName, realName, text_){
    partName.bind("input propertychange change", function(){
        $("#warning").children().remove();
        $("#warning").css('opacity', 0);
        if(partName.placeholder!=='') partName.value = '';
        if(!validator(partName.val(), realName)) {
            $('#'+realName+'-tip').css('color', 'red');
            $('#'+realName+'-tip').text(text_);
        }
        else {
            $('#'+realName+'-tip').css('color', 'mediumseagreen');
            $('#'+realName+'-tip').text("✔");
        }
    });
}