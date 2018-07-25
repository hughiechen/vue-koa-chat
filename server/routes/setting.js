const router = require('koa-router')()
const { query } = require('../utils/async-db')

router.prefix('/teamchat.html')

// 获取群信息
router.get('/Group/setting', async function (ctx, next) {
    
    const team_query=ctx.query

    console.log(team_query)
    
    let teamId=JSON.parse(team_query.teamId)
    // teamId[teamId.length]=parseInt(team_query.team_host_id)
    if(teamId){

      console.log( teamId )

      // 查询群会员
      async function checkTeamMember() {

        let sql = ` select member_id,teamId,realname,avatar ,teamName from (hs_sz_yi_teams_member left join hs_sz_yi_member on hs_sz_yi_teams_member.member_id = hs_sz_yi_member.id) left join hs_sz_yi_teams on hs_sz_yi_teams.id=hs_sz_yi_teams_member.teamId where hs_sz_yi_teams_member.teamId=${teamId}  `

        let TeamMembers= await query(sql)
        console.log( TeamMembers )
        
        return TeamMembers
      }

      let teamMembers= await checkTeamMember()
      ctx.body = {
        status:1,
        result:{
          msg:'success!查询群信息成功!',
          teamMembers
          
        }
      }
    }

})


router.post('/Group/setting',async (ctx,next)=>{
  const queryData= ctx.request.body
  console.log(queryData)

  let op=queryData.op
// 获取群成员
  if(op=='getMyfriends'){

    let userId=JSON.parse(queryData.userId)

    let teamId=JSON.parse(queryData.teamId)
    let leftfriendsList=[]

    // 查询好友列表
    async function getFriends (ctx,next){
      let sql = ` select * from hs_sz_yi_friend_succeed where uid = ${userId} or addid = ${userId} `
      let friendsList= await query(sql)
      return friendsList
    }

    // 获取群成员
    async function getTeamMembers(ctx,next){
      let sql = `select member_id from hs_sz_yi_teams_member where teamId  = ${teamId} `

      let memberIdList= await query(sql)

      return memberIdList
    }

    async function checkFriends(ctx,next){
      
      // 查询得到所有好友
      let teamMembers= await getTeamMembers()
      
      let friends= await getFriends().then(friends=>{
        for(let i = friends.length-1;i>=0;i--){
          console.log(i)
          
            // 遍历查找有在群聊里面的好友，在的话，就删除掉当前项
            for(let n=teamMembers.length-1;n>=0;n--){
              if(friends[i].uid==userId){
                // console.log(friends[i].addid,parseInt(teamMembers[n]))
                
                if(friends[i].addid==teamMembers[n].member_id){
                  
                  friends.splice(i,1)
                  
                }
              }else if(friends[i].addid==userId){
                
                // console.log(friends[i].uid,parseInt(teamMembers[n]))
                if(friends[i].uid==teamMembers[n].member_id){
                  
                  friends.splice(i,1)
                  
                }
              }
            }
            
        }

        return friends;
      })


      

      // async function check(ctx,next){

      //   friends.forEach(async (element,index,friendsARR) => {

      //     if(element.uid==userId){

      //       async function getfriendsList(ctx,next){
      //         let sql = `select member_id from hs_sz_yi_teams_member where teamId  = ${teamId} and member_id= ${element.addid}`
      //         let friendsList = await query(sql)
      //         return friendsList
      //       }

      //       await getfriendsList().then(List=>{

      //         if(List.length<=0){
      //           // friendsARR.splice(index,1)
      //           leftfriendsList.push(element)              
      //         }
      //       })
            
      //     }else if(element.addid==userId){
            
      //       async function getfriendsList(ctx,next){

      //         let sql = `select member_id from hs_sz_yi_teams_member where teamId  = ${teamId} and member_id= ${element.uid}`

      //         let friendsList = await query(sql)
      //         return friendsList
      //       }

      //       await getfriendsList().then(List=>{
      //         if(List.length<=0){
      //           // friendsARR.splice(index,1)
      //           leftfriendsList.push(element)
      //         }
      //       })
            
      //     }

      //     console.log(leftfriendsList.length,'aaaa')
          
      //     return leftfriendsList
        
      //   })

      //     console.log(leftfriendsList.length,'aaaa')
        
      //   return leftfriendsList

      // }
      
      // let afterChecklist= await check()
      // // console.log(leftfriendsList)
      // console.log(afterChecklist.length,'bbbb')
      return friends

    }

    let checkFriendslist =await checkFriends()
    
    ctx.body = {

      status:1,
      result:{
        msg:'success!查询成功!',
        checkFriendslist
      }

    }

  }else if(op=='changeName'){
// 修改群名称
    let teamId=JSON.parse(queryData.teamId)
    let TeamName=queryData.TeamName
    

    let sql = `UPDATE hs_sz_yi_teams SET teamName='${TeamName}' WHERE id=${teamId}`
    
    await query(sql).then(res=>{
      ctx.body = {
        status:1,
        result:{
          msg:'修改群名称成功!'
        }
      }
    })

    
    
  }else if(op=='inviteNewFriend'){
    // 邀请群好友
    let memberId=JSON.parse(queryData.member_id)
    let teamId=queryData.teamId
    memberId.forEach(Element=>{
      let sql = `INSERT INTO hs_sz_yi_teams_member (id,teamId,member_id) VALUES ('','${teamId}','${Element}')`
      query(sql)
      console.log( '插入会员数据成功,会员Id',Element ) 
    })

    // 返回提示      
    ctx.body = {
      status:1,
      result:{

        msg:'success!邀请会员成功!',
        teamId
        
      }
    }
  }else if(op=='deleteMembers'){
    // 删除群成员
    
    // 从请求数据中得到成员数据
    let memberId=JSON.parse(queryData.member_id)    
    let teamId=queryData.teamId
    memberId.forEach(Element=>{
      let sql = `DELETE from hs_sz_yi_teams_member where member_id=${Element}`
      query(sql)
      console.log( '删除会员数据成功,会员Id',Element ) 
    })

    // 返回数据
    ctx.body = {
      status:1,
      result:{

        msg:'删除成员成功!',
        teamId
    
      }
    }
  }



})
module.exports = router