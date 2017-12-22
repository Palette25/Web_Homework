'use strict';

var session = require('express-session');
var User = require('../Model/user.js');

exports.sess = function(err, data, user, name, request){
    var result = {};
    if(typeof name==='undefined'||name==='') {
        if(typeof user==='undefined'||user===null) {
            result['url'] = 'signin';
            result['flag'] = 1;
        }
        else {
            result['url'] = 'http://localhost:8000?username=' + user;
            request.session.flag = undefined;
            result['flag'] = 0;
        }
    }
    else {
        var detail_enable = name===user?1:0;
        console.log(detail_enable);
        if(typeof user ==='undefined'||user===null) {
            result['url'] = 'http://localhost:8000/';
            result['flag'] = 0;
        }
        else {
            if(detail_enable) {
                result['url'] = 'detail';
                result['flag'] = 1;
                result['data'] = data[0];
            }
            else {
                result['url'] = 'http://localhost:8000?username=' + user;
                request.session.flag = 1;
                result['flag'] = 0;
            }
        }
    }
    return result;
}

exports.db_sess_test = function(data, callback){
    User.findUser_By_Name(data, callback);
}

exports.db_repeat_test = function(callback){
    User.All_Users(callback);
}

exports.judge_repeat = function(all_user, data, p_flag){
    var result = [], flag = [0, 0, 0, 0], judge_result = {};
    for(var i=0;i<all_user.length;i++){
        if(all_user[i].username===data.name&&!flag[0]){
            result.push(1);
            flag[0] = 1;
        }
        if(all_user[i].id===data.id&&!flag[1]){
            result.push(2);
            flag[1] = 1;
        }
        if(all_user[i].phone===data.phone&&!flag[2]){
            result.push(3);
            flag[2] = 1;
        }
        if(all_user[i].mail===data.mail&&!flag[3]){
            result.push(4);
            flag[3] = 1;
        }
    }
    var result_ = "", r_flag = result.length===0?0:1;
    for(var i=0;i<result.length;i++){
        result_ += result[i];
    }
    console.log(result_);
    judge_result['data'] = result_;
    if(!r_flag&&!p_flag){
        store_user(data);
        store_session(data);
    }
    return judge_result;
}

exports.db_login_test = function(data, callback){
    User.testPwd_By_Name(data, callback);
}

var store_user = function(data){
    var new_user = {
        username: data.name,
        password: User.GetEncode_SHA256(data.pass),
        id: data.id,
        phone: data.phone,
        mail: data.mail
    }
    User.Insert_User(new_user);
}

exports.judge_flag = function(err, docs, data){
    var flag = "2";
    if(err||docs.length===0) flag = "0";
    else {
        var decode_pass = User.GetDecode_SHA256(docs[0].password);
        if(decode_pass!==data.pass) flag = "1";
        else store_session(data);
    }
    return flag;
}

var store_session = function(sess_user){
    var new_sess_user = {
        username: sess_user.name
    }
    User.Insert_session(new_sess_user);
}

exports.delete_session = function(){
    User.Delete_session();
}

exports.get_session = function(callback){
    User.Get_session(callback);
}