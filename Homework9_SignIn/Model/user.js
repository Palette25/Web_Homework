'use strict';

var mongo = require('mongoose');
var crypto = require('crypto');
mongo.connect('mongodb://palette:1377278217@127.0.0.1:27017/User', {useMongoClient:true});

var db = mongo.connection;
var Schema = mongo.Schema;
var user_schema = new Schema({
    username: String,
    password: String,
    id: String,
    phone: String,
    mail: String
});
var session_schema = new Schema({
    username: String
});
user_schema.set('collection', 'user');
session_schema.set('collection', 'session');
var userModel = db.model('user', user_schema);
var sessModel = db.model('session', session_schema);

exports.All_Users = function(callback){
    userModel.find({}, callback);
}

exports.Insert_User = function(new_user){
    var new_entity = new userModel(new_user);
    new_entity.save(function(err, docs){
        if(err) throw err;
        else {
            console.log(docs);
        }
    });
}

exports.findUser_By_Name = function(username, callback){
    userModel.find({'username': username}, callback);
}

exports.testPwd_By_Name = function(data, callback){
    userModel.find({'username':data.name}, callback);
}

exports.Insert_session = function(sess_user){
    var new_Entity = new sessModel(sess_user);
    new_Entity.save(function(err, docs){
        if(err) throw err;
        else console.log(docs);
    });
}

exports.Get_session = function(callback){
    sessModel.find({}, callback);
}

exports.Delete_session = function(){
    sessModel.remove({}, function(err){
        if(err) throw err;
    })
}

exports.GetEncode_SHA256 = function(str){
    var secret = 'HoShiNoGen', key = secret.toString('hex');
    var cipher = crypto.createCipher('aes192', key);
    var encode_result = cipher.update(str, 'utf-8', 'hex');
    encode_result += cipher.final('hex');
    return encode_result;
}

exports.GetDecode_SHA256 = function(str){
    var secret = 'HoShiNoGen', key = secret.toString('hex');
    var decipher = crypto.createDecipher('aes192', key);
    var decode_result = decipher.update(str, 'hex', 'utf-8');
    decode_result += decipher.final('utf-8');
    return decode_result;
}