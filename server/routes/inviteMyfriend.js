const router = require('koa-router')()
const { query } = require('../utils/async-db')
// 引入redis库
var redis = require('redis');
var redisStore = require('koa-redis');
var client = redis.createClient(6379, "127.0.0.1", { password: "124.95redis" });
// var client = redis.createClient(6379, "127.0.0.1");
const expire = 60*60
var options = {client: client, db: 0};
var store = redisStore(options);

router.prefix('/teamchat.html')

// 处理好友请求
router.get('/inviteMyfriend', async(ctx, next)=>{

    // let userId=JSON.parse(ctx.query.userId)
  // 处理好友列表加载，当没有参数时返回好友列表
    let friendsList=[]
    async function selectAllFriendData() {
      let sql = `select * from hs_sz_yi_friend_succeed`
      let dataList = await query(sql)
      return dataList
    }

    friendsList = await selectAllFriendData()
    // console.log( '数据库连接成功' )  
    friendsList=JSON.parse(JSON.stringify(friendsList))
    
    // console.log(friendsList)
    
    // 返回好友列表
    ctx.body = {
      status:1,
      result:friendsList
    }
})

// 创建群聊
router.get('/inviteMyfriend/join', async function (ctx, next) {
    //新创建群，插入群数据，
    const team_query=ctx.query
    let memberId=JSON.parse(team_query.member_id)
    memberId[memberId.length]=parseInt(team_query.team_host_id)
      console.log( memberId)
    const createtime=new Date().getTime()/1000
    // console.log(createtime,team_query)

    console.log(team_query)

    // 插入群信息
    async function insertGroup() {

      let sql = `INSERT INTO  hs_sz_yi_teams (id,team_host_id,createtime,teamName) VALUES (null,'${team_query.team_host_id}','${createtime}','群聊')`
      let cur_insertId =await query(sql)

      console.log('创建群成功',cur_insertId)

      return cur_insertId.insertId     
    }

    // 插入群会员信息
    async function insertGroupMembers() {

      const cur_insertId = await insertGroup()
      
      memberId.forEach(Element=>{
        let sql = `INSERT INTO hs_sz_yi_teams_member (id,teamId,member_id) VALUES (null,'${cur_insertId}','${Element}')`
        query(sql)
        console.log( '插入会员数据成功,会员Id',Element ) 
      })

       
      return cur_insertId
    }

    await insertGroupMembers().then(cur_insertId=>{
      
      // 返回提示      
      ctx.body = {
        status:1,
        result:{
          msg:'Success!创建群成功!',
          teamId:cur_insertId,
          teamName:'群聊'
        }
      }
      
    })
})

// 加载群组信息
router.get('/myTeam', async (ctx, next) => {
  const userId=ctx.cookies.get('userId')

  if(userId){
    let user="user"+JSON.parse(userId)
    console.log(userId)

    // 根据userId查询群组信息
    async function checkMyGroup() {

      let sql = ` select * from (hs_sz_yi_teams left join hs_sz_yi_teams_member on hs_sz_yi_teams.id=hs_sz_yi_teams_member.teamId) left join hs_sz_yi_member on hs_sz_yi_member.id=hs_sz_yi_teams_member.member_id where hs_sz_yi_member.id=${userId} ORDER BY hs_sz_yi_teams.id ASC `
      // 查询获取群信息
      let groupInfo =await query(sql)

      // 把群id存储在redis
      let newGroupInfo=[]
      for (let v of groupInfo){
        // 把群id信息存在redis的hash表中

        // 判断redis哈希表是否存在群id
        let exist=await store.client.hexists(user, v.teamId)
        if(!exist){
          await store.client.hmset(user, v.teamId,0)
        } 
        
        // 同步读取redis里面的群是否已读数据
        let readStatus= Number( await store.client.hmget(user, v.teamId) )
        
        // 把已读状态添加到每个群的每一项
        let newsItem = Object.assign({},v,{
          readStatus
        })

        newGroupInfo.push(newsItem)
      }

      // console.log(newGroupInfo)
      return newGroupInfo;

    }

    await checkMyGroup().then( groupInfo =>{

      ctx.body={
        status:1,
        result:groupInfo
      }

    })

  }else{
    await ctx.response.redirect('http://huang.iiio.top/app/index.php?i=1&c=entry&p=login&do=member&m=sz_yi');
  }

})

// 改变群消息已读状态
router.get('/myTeam/changeReadStatus', async (ctx, next) =>{

  let {teamId, userId} = ctx.query

  let user="user"+userId
  console.log(user)
  await store.client.hmset(user, teamId,1)

  ctx.body={
    status:1,
    msg:'已读！'
  }

})

module.exports = router
