/**
* @Author: sundexin <sundx>
* @Date:   2016-10-01T15:40:45+08:00
* @Email:  20108847@qq.com
* @Project: my Projece
* @Last modified by:   sundx
* @Last modified time: 2016-10-01T18:24:43+08:00
*/


var express = require('express');
var router = express.Router();
var forwards = require('../public/javascripts/forward.js');

/* GET home page. */
router.get('/', forwards.indexJs);

router.get('/about', function(req, res, next) {
  res.render('about', {
    title: '一个express单页面应用',
    context: '关于我们页面'
  });
});

router.get('/concat', function(req, res, next) {
  res.render('concat', {
    title: '一个express单页面应用',
    context: '联系我们页面'
  });
});

// 此处的例子是如果本页面没有使用公共的layout模板的时候， 当然这里也包含不使用layout模板 layout: null
router.get('/concat-layout', function(req, res, next) {
  res.render('custom-layout', {
    layout: 'custom'
  });
});

// 这个路由只是测试请求报头的信息，都给服务器发送了什么内容
router.get('/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  for (var name in req.headers) {
    s += name + ' : ' + req.headers[name] + '\n';
  }
  res.send(s);
});

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
router.get('/user/:id', function(req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0) next('route');
  // 负责将控制权交给栈中下一个中间件
  else next(); //
}, function(req, res, next) {
  // 渲染常规页面
  res.render('user', {
    title: 'Express user',
    context: 'user pages'
  });
});

module.exports = router;
