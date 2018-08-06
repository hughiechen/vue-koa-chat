const Koa = require('koa')
const app = new Koa()
const path = require('path')
const views = require('koa-views')
const json = require('koa-json')
const cors = require('koa2-cors');
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session');
const convert = require('koa-convert')
// 处理静态资源
const static = require('koa-static')
app.use(bodyparser())

const { query } = require('./utils/async-db')

const index = require('./routes/index')
const users = require('./routes/users')
const inviteMyfriend = require('./routes/inviteMyfriend')
const setting = require('./routes/setting')
const friendsCircle = require('./routes/friendsCircle')
const groupNews = require('./routes/groupNews')

// async function selectAllData( ) {
//   let sql = 'SELECT * FROM h3'
//   let dataList = await query( sql )
//   return dataList
// }




// // 存储用户session
app.keys = ['some secret hurr'];
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

// async function selectAllData() {
//     let sql = 'SELECT * FROM hs_sz_yi_member '
//     let dataList = await query(sql)
//     return dataList
//   }

// async function getData() {
//   let dataList = await selectAllData()
//   console.log( '数据库连接成功' )  
//   console.log( dataList )
// }

// getData()

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
 
// 设置跨域请求
app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(json())
app.use(logger())
// 静态资源目录
const staticPath = '/public'
app.use(convert(static(
  path.join( __dirname,  staticPath)
)))
// app.use(static(
//   path.join( __dirname, staticPath)
// ))
// app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 处理好友列表请求
// app.use(async (ctx)=>{
//   let ctx_query=ctx.query
//   console.log(ctx_query)
//   if(ctx_query.userId){
//     async function selectAllData() {
//       // let sql = 'SELECT * FROM hs_sz_yi_friend_succeed '
//       let sql = 'SELECT * FROM h3 '
      
//       let dataList = await query(sql)
//         return dataList
//     }

//     async function getData() {
//       let dataList = await selectAllData()
//       console.log( '数据库连接成功' )  
//       console.log( dataList )
//       ctx.body={
//         dataList
//       }
//     }

//     getData()
//   }
// })




// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(inviteMyfriend.routes(), inviteMyfriend.allowedMethods())
app.use(setting.routes(), setting.allowedMethods())
app.use(friendsCircle.routes(), friendsCircle.allowedMethods())
app.use(groupNews.routes(), groupNews.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
