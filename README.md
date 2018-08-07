# Vue.js+Socket.io+Koa2+redis打造一个仿微信聊天

Vue.js+Socket.io+Koa2+redis打造一个仿微信聊天


## 源代码
 现在已经开源： 👉https://github.com/hillmychen/vue-koa-chat
 欢迎star和提出宝贵意见😄

## 技术栈
* **Vue2**：前端页面展示。
* **Socket.io**：实现实时通信
* **Vuex**：Vuex，实现不同组件间的状态共享
* **vue-router**：页面路由切换
* **axios**：一个基于 `Promise` 的 HTTP 库，向后端发起请求。
* **Koa2**：Koa2做后台。
* **redis**：聊天内容因为怕消息太多，保存在数据库操作会很慢，所以用了redis存储。
* **Moment.js**：一个时间处理的库，方便对时间进行格式化成需要的格式。
* **ES6**、**ES7**：采用ES6语法，这是以后的趋势。箭头函数、Promise等等语法很好用。
* **localStorage**：保存用户信息以及聊天记录。
* **Webpack**：vue-cli自带Webpack，但是需要自己改造一下，比如要对需要安装sass相关loader，vue-cli已经配置好了webpack，你只需要安装依赖就可以，使用的时候只需要`<style lang="scss"></style>`。
* **SASS**(**SCSS**)：用SCSS做CSS预处理语言，有些地方很方便，个人很喜欢用。(详看👉[SASS用法指南](https://microzz.com/2017/03/18/sass/))
* **flex**：flex弹性布局，**简单**适配手机、PC端。
* **CSS3**：CSS3过渡动画及样式。

## 分析

### Socket.io
通过Koa在服务端可以这样做:

```javascript
// Server (app.js)

var app = require('koa')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```

客户端代码

```javascript
// Client (index.html)

<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
</script>
```

不管是服务器还是客户端都有 `emit` 和 `on` 这两个函数，可以说 socket.io 的核心就是这两个函数了，通过 `emit` 和 `on` 可以轻松地实现服务器与客户端之间的双向通信。

`emit` ：用来发射一个事件或者说触发一个事件，第一个参数为事件名，第二个参数为要发送的数据，第三个参数为回调函数（一般省略，如需对方接受到信息后立即得到确认时，则需要用到回调函数）。
`on` ：用来监听一个 emit 发射的事件，第一个参数为要监听的事件名，第二个参数为一个匿名函数用来接收对方发来的数据，该匿名函数的第一个参数为接收的数据，若有第二个参数，则为要返回的函数。
socket.io 提供了三种默认的事件（客户端和服务器都有）：`connect` 、`message` 、`disconnect` 。当与对方建立连接后自动触发 `connect` 事件，当收到对方发来的数据后触发 `message` 事件（通常为 `socket.send()` 触发），当对方关闭连接后触发 `disconnect` 事件。

此外，socket.io 还支持自定义事件，毕竟以上三种事件应用范围有限，正是通过这些自定义的事件才实现了丰富多彩的通信。

最后，需要注意的是，在服务器端区分以下三种情况：

`socket.emit()` ：向建立该连接的客户端广播
`socket.broadcast.emit()` ：向除去建立该连接的客户端的所有客户端广播
`io.sockets.emit()` ：向所有客户端广播，等同于上面两个的和

## Vue.js
在Vue的方面就比较常规了，Vue全家桶：Vue2.0+Vuex+axios+vue-router

## 总结

1. 组件状态多了用Vuex管理很方便
2. 事先一定要先想好整个页面组成，怎样去分组件开发，这样在开发阶段会事半功倍。
3. Moment.js在Vue中用ES6的方式引入会有问题，可以尝试在main.js尝试这样`import moment from 'moment'` `Vue.prototype.moment = moment;`给Vue的原型上添加moment，这样就可以在Vue的实例中随意使用它了。
4. get方式通过URL传参最好使用`encodeURI`对参数进行编码
5. 一定要处理好那些异步操作，否则会带来各种问题。开发阶段使用的是`Promise`，上线时候使用了ES7的`Async`+`Promise`的组合，让异步操作更加合理。

## About
关于我：👉https://github.com/hillmychen

GitHub：👉 https://github.com/hillmychen

E-mail: 👉 zuixingshifen@gmail.com

