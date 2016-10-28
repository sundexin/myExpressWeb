/**
 * @Author: sundexin <sundx>
 * @Date:   2016-10-01T17:04:40+08:00
 * @Email:  20108847@qq.com
 * @Project: my Projece
 * @Last modified by:   sundx
 * @Last modified time: 2016-10-01T17:20:34+08:00
 */


// 随机数组

var forward = [
  'indexpage',
  'aboutpage',
  'concatpage'
];

var getForward = function() {
  var idx = Math.floor(Math.random() * forward.length);

  return forward[idx];
};


// 路由信息
var indexJs = function(req, res, next) {
  res.render('index', {
    title: '一个express单页面应用',
    context: '不抛弃，不放弃！',
    fortune: getForward()
  });
};

module.exports = {
  indexJs: indexJs,
  getForward: getForward
};
