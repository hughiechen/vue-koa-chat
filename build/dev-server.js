require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')


// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express();
var router = express.Router();

const server = require('http').Server(app);

const io = require('socket.io')(server);

const http = require('http');

const https = require('https');

var bodyParser = require('body-parser');

// var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

io.on('connection', (socket) => {

  // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
  var socketId=socket.id;
  console.log(socketId)
  var url = socket.request.headers.referer;
  var splited = url.split('/');
  var roomID = splited[splited.length - 1];   // 获取房间ID
  var user = '';

  socket.on('join', function (userName) {
    user = userName;
 
    // 将用户昵称加入房间名单中
    if (!roomInfo[roomID]) {
      roomInfo[roomID] = [];
    }
    roomInfo[roomID].push(user);
 
    socket.join(roomID);    // 加入房间
    // 通知房间内人员
    socketIO.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);  
    console.log(user + '加入了' + roomID);
  });


  // 群聊
  socket.on('sendGroupMsg', function (data) {
    socket.broadcast.emit('receiveGroupMsg', data);
  });

  // 上线
  socket.on('online', name => {
    socket.broadcast.emit('online', name)
  });

  // socket.on('disconnect', function () {
  //   // 从房间名单中移除
  //   var index = roomInfo[roomID].indexOf(user);
  //   if (index !== -1) {
  //     roomInfo[roomID].splice(index, 1);
  //   }
 
  //   socket.leave(roomID);    // 退出房间
  //   socketIO.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
  //   console.log(user + '退出了' + roomID);
  // });

  // // 接收用户消息,发送相应的房间
  // socket.on('message', function (msg) {
  //   // 验证如果用户不在房间内则不给发送
  //   if (roomInfo[roomID].indexOf(user) === -1) {  
  //     return false;
  //   }
  //   socketIO.to(roomID).emit('msg', user, msg);
  // });

})


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)



// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))



var uri = 'http://localhost:' + port

// var uri = 'http://huang.iiio.top' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})


console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// room page
router.get('/room/:roomID', function (req, res) {
  var roomID = req.params.roomID;
 
  // 渲染页面数据(见views/room.hbs)
  res.render('room', {
    roomID: roomID,
    users: roomInfo[roomID]
  });
});
 
app.use('/', router);

// var server = app.listen(port)

server.listen(3000);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
