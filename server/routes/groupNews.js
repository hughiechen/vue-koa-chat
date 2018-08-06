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

// 获取群聊信息
router.get('/Group',async (ctx,next)=>{
    let {op}=ctx.query

    // 获取群聊信息
    if(op == "getGroupNews") {
        let {teamId} = ctx.query
        console.log(teamId)
        let cur_teamId=Number(teamId)
        // 定义变量保存消息数据
        let roomDataList=[]

        // 读取redis消息数据
        
        // 判断是否redis存在群里id信息
        let exist= await store.client.exists(teamId)
        if(exist){
            // 获取消息数据列表长度
            let length=await store.client.llen(teamId)
            console.log("消息长度为："+length)
            // 获取群聊消息数据列表
            roomDataList=await store.client.lrange(teamId,0, length-1)

            roomDataList=roomDataList.map(v=>{
                return JSON.parse(v)
            })
            console.log(roomDataList)

             // 返回群聊数据
            ctx.body={
                state:1,
                roomDataList
            }
  
        }else{
            // 如果不存在群数据
            
            // 查询群会员
            let sql = ` select member_id,realname from (hs_sz_yi_teams_member left join hs_sz_yi_member on hs_sz_yi_teams_member.member_id = hs_sz_yi_member.id) left join hs_sz_yi_teams on hs_sz_yi_teams.id=hs_sz_yi_teams_member.teamId where hs_sz_yi_teams_member.teamId=${cur_teamId}  `

            let TeamMembers= await query(sql)

            // 遍历群会员，写入消息已读状态为已读
            TeamMembers.map(async v=>{
                console.log(`user${v.member_id}`)

                await store.client.hmset(`user${v.member_id}`, teamId,1)

            })

            ctx.body={
                state:-1,
                msg:'没有群聊消息！',
                roomDataList
            }
        }
        
       
    }
})


module.exports=router