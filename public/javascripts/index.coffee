forward = [
  'indexpage'
  'aboutpage'
  'concatpage'
]

getForward = ->
  idx = Math.floor(Math.random() * forward.length)
  forward[idx]

# 路由信息

indexJs = (req, res, next) ->
  res.render 'index',
    title: '一个express单页面应用'
    context: '不抛弃，不放弃！'
    fortune: getForward()
  return

module.exports =
  indexJs: indexJs
  getForward: getForward
