'use strict';
var validator = require('../Model/validator.js');
var control = require('../Controller/control.js');

module.exports = function(app){
    app.route('/').get(
        function(request, response, next){
            var name = validator.parseName(request.url);
            control.get_session(
                function(err, docs){
                    var now_user = docs.length===0?undefined:docs[0].username;
                    control.db_sess_test(now_user, function(err, docs){
                        var sess_judge = control.sess(err, docs, now_user, name, request);
                        var render_or_redict = sess_judge.flag, page_url = sess_judge.url, sess_data = sess_judge.data;
                        if(request.session.flag&&sess_data) sess_data['flag'] = 1;
                        //0 represents render, 1 represents redirect
                        if(render_or_redict){
                            request.session.flag = undefined;
                            if(sess_data) response.render(page_url, sess_data);
                            else response.render(page_url);
                        }else {
                            response.redirect(page_url);
                        }
                    });
                }
            )
    });
    
    app.route('/regist').get(
        function(request, response, next){
            control.get_session(
                function(err, docs){
                    var now_user = docs.length===0?undefined:docs[0].username;
                    if(now_user){
                        response.redirect('http://localhost:8000?username='+now_user);
                    }else {
                        response.render('index');
                    }
                }
            )
    });

    app.route('/regist').post(
        function(request, response, next){
            var data = request.body, p_flag = request.body.flag - '0';
            response.writeHead(200, {'Content-Type':'text/plain'});
            control.db_repeat_test(function(err, docs){
                var judge_result = control.judge_repeat(docs, data, p_flag);
                response.end(judge_result.data);
            });
            next();
    });

    app.route('/').post(
        function(request, response, next){
            var data = request.body;
            response.writeHead(200, {'Content-Type':'text/plain'});
            control.db_login_test(data, function(err, docs){
                var flag = control.judge_flag(err, docs, data);
                response.end(flag);
            });
            next();
        }
    )

    app.route('/logout').post(
        function(request, response, next){
            control.delete_session();
            request.session.flag = undefined;
            response.writeHead(200, {'Content-Type':'text/plain'});
            response.end();
            next();
        }
    )
}