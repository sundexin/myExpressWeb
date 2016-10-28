/**
 * @Author: sundexin <sundx>
 * @Date:   2016-10-01T15:40:45+08:00
 * @Email:  20108847@qq.com
 * @Project: my Projece
 * @Last modified by:   sundx
 * @Last modified time: 2016-10-06T14:04:36+08:00
 */

/**
 * express 生成一个express实例
 * app.set views  设置views文件夹存放视图目录
 * app.set('view engine', 'jade') 设置视图模板引擎
 * favicon  设置favicon图标
 * logger 加载日志中间件
 * bodyParser.json 加载解析json中间件
 * urlencoded 加载解析urlencoded请求体中间件
 * cookieParser 加载解析cookieParser中间件
 * static 设置public文件夹为存放静态文件的目录
 *
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var coffee = require('express-coffee-script');
// var coffee = require('coffee-script');

// 路由配置
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// app.use(coffee({
//   src: './public/javascripts',
//   dest: './publicjavascripts',
//   prefix: 'javascripts',
//   compilerOpts: {
//     bare: true
//   }
//
// }));
// // app.use(express.static, 'public');
//
// var stylus = require('express-stylus');
// var nib = require('nib');
// var join = require('path').join;
// var publicDir = join(__dirname, '/public');
//
//
// app.use(stylus({
//   src: publicDir,
//   use: [ nib() ],
//   import: [ 'nib' ]
// }));
// app.use(express.static(publicDir));

// 视图引擎设置，路径，不打印jade的渲染日志,包括debug模式的日志，和视图的缓存等。
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// coffeecup 模板引擎，这里暂时没用
// app.set('view engine', 'coffee');
// app.engine('coffee', require('coffeecup').__express);

// 对象参数是：命令行就不会打印jade的渲染日志
app.set('view options', {
  debug: true,
  compileDebug: false
});
app.set('view cache', true);

// // 设置浏览器的的图标和公共注释，根目录为/public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 日志文件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// 这里的static目录是一个虚拟目录
// app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// 捕获404错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '/public/dev')));
} else {
  app.use(express.static(path.join(__dirname, '/public/dist')));
}

console.log(process.env.NODE_ENV);

// 开发环境下的错误处理，将错误信息渲染error模板中
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产环境下的错误处理，将错误信息渲染error模板中
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
