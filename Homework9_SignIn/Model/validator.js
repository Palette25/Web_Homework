'use strict';
var url = require('url');
var querystring = require('querystring');

exports.parseName = function(_url){
    return querystring.parse(url.parse(_url).query).username;
}

