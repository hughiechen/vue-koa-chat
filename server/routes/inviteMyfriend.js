const router = require('koa-router')()
const { query } = require('../utils/async-db')

router.prefix('/teamchat.html')

// 处理好友请求
router.get('/inviteMyfriend', async function (ctx, next) {
  // 处理好友列表加载，当没有参数时返回好友列表
    let friendsList=[]
    async function selectAllFriendData() {
      let sql = 'select * from hs_sz_yi_friend_succeed where uid = ${userId} or addid = ${userId} '
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
    const createtime=new Date().getTime()
    // console.log(createtime,team_query)

    console.log(team_query)

    // 插入群信息
    async function insertGroup() {

      let sql = `INSERT INTO  hs_sz_yi_teams (id,team_host_id,createtime,teamName) VALUES ('','${team_query.team_host_id}','${createtime}','我的群聊')`
      let cur_insertId =await query(sql)

      console.log('创建群成功',cur_insertId)

      return cur_insertId.insertId     
    }

    // 插入群会员信息
    async function insertGroupMembers() {

      const cur_insertId = await insertGroup()
      
      memberId.forEach(Element=>{
        let sql = `INSERT INTO hs_sz_yi_teams_member (id,teamId,member_id) VALUES ('','${cur_insertId}','${Element}')`
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
          msg:'success!创建群成功!',
          teamId:cur_insertId
          
        }
      }
      
    })
})

// 加载群组信息
router.get('/myTeam', async (ctx, next) => {
  const userId=ctx.cookies.get('userId')

  if(userId){
    console.log(userId)

    // 根据userId查询群组信息
    async function checkMyGroup() {

      let sql = ` select * from (hs_sz_yi_teams left join hs_sz_yi_teams_member on hs_sz_yi_teams.id=hs_sz_yi_teams_member.teamId) left join hs_sz_yi_member on hs_sz_yi_member.id=hs_sz_yi_teams_member.member_id where hs_sz_yi_member.id=${userId} ORDER BY hs_sz_yi_teams.id ASC `
      
      let groupInfo =await query(sql)

      console.log(groupInfo)
      return groupInfo;

    }

    await checkMyGroup().then(groupInfo=>{

      ctx.body={
        status:1,
        result:groupInfo
      }

    })

  }else{
    await ctx.response.redirect('http://huang.iiio.top/app/index.php?i=1&c=entry&p=login&do=member&m=sz_yi');
  }

})

module.exports = router
