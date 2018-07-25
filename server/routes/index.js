const router = require('koa-router')()


router.get('/', async (ctx, next) => {

  const userId=ctx.cookies.get('userId')
  console.log(userId)
  await ctx.response.redirect('/teamchat.html');  
  
})


// 通过url地址读取用户id
router.get('/:id', async (ctx, next) => {
  const userId=ctx.cookies.get('userId')
  if(userId){
    await ctx.response.redirect('/teamchat.html');
    return;
  }else{
    const userId=ctx.params.id
    ctx.cookies.set(
      'userId', 
      userId,
      {
      //   domain: 'http://localhost:8888',  // 写cookie所在的域名
      //   path: '/',       // 写cookie所在的路径
      //   maxAge: 7*24*60 * 60 * 1000, // cookie有效时长
      //   expires: new Date('2018-08-08'),  // cookie失效时间
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
      }
    )

    await ctx.response.redirect('/teamchat.html');
    
  }
})

// 通过url获取朋友圈id
router.get('/friendscircle/:id', async (ctx, next) => {
  const userId=ctx.cookies.get('userId')
  if(userId){
    await ctx.response.redirect('/teamchat.html#/friendscircle');
    return;
  }else{
    const userId=ctx.params.id
    ctx.cookies.set(
      'userId', 
      userId,
      {
      //   domain: 'http://localhost:8888',  // 写cookie所在的域名
      //   path: '/',       // 写cookie所在的路径
      //   maxAge: 7*24*60 * 60 * 1000, // cookie有效时长
      //   expires: new Date('2018-08-08'),  // cookie失效时间
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
      }
    )

    await ctx.response.redirect('/teamchat.html#/friendscircle');
    
  }
})

// router.get('/teamchat.html/myTeam', async (ctx, next) => {
//   const userId=ctx.cookies.get('userId')

//   ctx.body={
//     status:1
//     // result:res
//   }

//   // if(userId){
//   //   console.log(userId)
//   //   // 根据userId查询群组信息
//   //   async function checkMyGroup() {

//   //     let sql = ` select * from hs_sz_yi_member where id=${userId} `
//   //     let groupInfo =await query(sql)

//   //     console.log(groupInfo)
//   //     return groupInfo;

//   //   }

//   //   await checkMyGroup().then(res=>{
//   //     ctx.body={
//   //       status:1,
//   //       result:res
//   //     }
//   //   })

//   // }else{
//   //   await ctx.response.redirect('http://huang.iiio.top/app/index.php?i=1&c=entry&p=login&do=member&m=sz_yi');
//   // }

// })

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }

  console.log(ctx.cookies.get('userId'))
  
})



module.exports = router
