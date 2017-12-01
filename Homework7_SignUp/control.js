var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

//处理url后带的querystring
function parseName(_url){
    return querystring.parse(url.parse(_url).query).username;
}

//在存储的json文件中查找
function find(name){
    var data = fs.readFileSync('./store.json', 'utf-8');
    var result = JSON.parse(data);
    for(var i=0;i<result.length;i++){
        if(result[i].username==name) return true;
    }
    return false;
}

//动态生成index.html界面
function write_index(response){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write('<!DOCTYPE HTML>\n<html>\n<head>\n<meta charset="utf-8"/>\n<title>Sign Up</title>\n');
    response.write('<script src="./jquery-3.2.1.js"></script>\n<link rel="stylesheet" type="text/css" href="./style.css" />\n<script src="./script.js"></script>\n</head>\n');
    response.write('<body>\n<h2>用户注册</h2>\n<form action="http://127.0.0.1:8000" method="post">\n');
    response.write('<div>用户名: <input type="text" name="name" id="name" placeholder="Username"></div>\n<p id="name-tip"></p>\n');
    response.write('<div><span>学号: </span><input type="text" name="id" id="id" placeholder="Student ID"></div>\n<p id="id-tip"></p>\n');
    response.write('<div><span>电话: </span><input type="text" name="phone" id="phone" placeholder="Phone Number"></div>\n<p id="phone-tip"></p>\n');
    response.write('<div><span>邮箱: </span><input type="text" name="mail" id="mail" placeholder="E-mail"></div>\n<p id="mail-tip"></p>\n');
    response.write('<div id="btn"><input type="button" id="reset" value="重置" />\n<input type="button" id="submit" value="提交" /></div>\n</form>');
    response.write('<div id="warning"></div></body>\n</html>\n');
}

//动态生成detail.html界面
function write_detail(response, name){
    var student_id, phone, e_mail;
    var data = fs.readFileSync('./store.json', 'utf-8');
    var result = JSON.parse(data);
    for(var i=0;i<result.length;i++){
        if(result[i].username==name){
            student_id = result[i].id;
            phone = result[i].phone;
            e_mail = result[i].mail;
        }
    }
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write('<!DOCTYPE HTML>\n<html>\n<head>\n<meta charset="utf-8"/>\n<title>User Information</title>\n');
    response.write('<script src="./jquery-3.2.1.js"></script>\n<link rel="stylesheet" type="text/css" href="./style.css" />\n<script src="./script.js"></script>\n</head>\n');
    response.write('<body>\n<h2>用户详情</h2>\n<div class="detail"><span>用户名: </span>' + name + '</div>\n');
    response.write('<div class="detail"><span>学号: </span>' + student_id + '</div>\n');
    response.write('<div class="detail" ><span>电话: </span>' + phone + '</div>\n');
    response.write('<div class="detail"><span>邮箱: </span>' + e_mail + '</div>\n');
    response.write('<div id="btn"><input type="button" id="re_index" value="返回注册界面" /></div>\n');
}

function handle_other_request(response, filepath){
    var path = filepath.substr(1, filepath.length);
    for(var i=0;i<path.length;i++){
        if(path[i]==='.') break;
    }
    var type = path.substr(i+1, path.length);
    fs.readFile('./'+path, 'utf-8', function(err, data){
        if(err) throw err;
        if(type==='js') response.writeHead(200, {'Content-Type':'text/javascript'});
        else response.writeHead(200, {'Content-Type':'text/' + type});
        response.end(data);
    });
}

function find_repeat(input){
    var result = [], flag = [0, 0, 0, 0];
    var data = fs.readFileSync('./store.json', 'utf-8'), json_obj = JSON.parse(data);
    for(var i=0;i<json_obj.length;i++){
        if(json_obj[i].username===input.name&&!flag[0]) {
            result.push(1);
            flag[0] = 1;
        }
        if(json_obj[i].id===input.id&&!flag[1]) {
            result.push(2);
            flag[1] = 1;
        }
        if(json_obj[i].phone===input.phone&&!flag[2]) {
            result.push(3);
            flag[2] = 1;
        }
        if(json_obj[i].mail===input.mail&&!flag[3]) {
            result.push(4);
            flag[3] = 1;
        }
    }
    return result;
}

function handle_index(request, response){
    var all_data = "", flag;
    request.on('data', function(chunk){
        all_data += chunk;
        if(all_data.length==0) flag = false;
        else flag = true;
    });
    request.on('end', function(){
        if(!flag){
            write_index(response);
            response.end();
            return;
        }
        var result = querystring.parse(all_data);
        var repeat_arr = find_repeat(result), len = repeat_arr.length, r_flag = len===0?0:1, p_flag = result.flag;
        p_flag = parseInt(p_flag);
        if(!r_flag&&!p_flag){
            var json = {
                username: result.name,
                id: result.id,
                phone: result.phone,
                mail: result.mail
            };
            //将store.json文件内的数据全部读出来，然后重新增加新数据，写入
            var content = fs.readFileSync('./store.json', 'utf-8');
            var json_obj = JSON.parse(content);
            fs.writeFileSync('./store.json', '[\n');
            for(var i=0;i<json_obj.length;i++){
                if(i!==json_obj.length-1) fs.appendFileSync('./store.json', JSON.stringify(json_obj[i])+'\,\n');
                else fs.appendFileSync('./store.json', JSON.stringify(json_obj[i]));
            }
            //若原本存储数据为空，不需要加','
            var temp = "";
            if(json_obj.length!==0){
                temp += '\,\n';
            }
            temp += JSON.stringify(json)+'\n]';
            if(typeof json.username!=='undefined')
                fs.appendFileSync('./store.json', temp);
            else fs.appendFileSync('./store.json', '\n]');
            response.writeHead(200, {'Content-Type':'text/plain'});
            response.end();
            }
            else {
                if(r_flag) {
                    response.writeHead(400, {'Content-Type':'text/plain'});
                    var str = "";
                    for(var i=0;i<len;i++)
                        str += repeat_arr[i];
                    response.end(str);
                }else {
                    response.writeHead(200, {'Content-Type':'text/plain'});
                    response.end();
                }
            }
        });
}

var server = http.createServer(
    function(request, response){
        var name = parseName(request.url);
        var method_flag = typeof name==='undefined'?1:0;
        var find_flag = find(name);
        if(request.url!==''&&request.url!=='/'&&method_flag){
            handle_other_request(response, request.url);
        }else{
            if(method_flag||!find_flag){
                handle_index(request, response);
            }else if(find_flag){
                write_detail(response, name);
                response.end();
            }
        }
    }
).listen(8000);

console.log('Server running at http://127.0.0.1:8000');