const router = require('koa-router')()
// 处理图片上传模块
const multer = require('koa-multer');
const mkdirp = require('mkdirp');
const fs = require('fs');

const { query } = require('../utils/async-db')
router.prefix('/teamchat.html')

// 获取朋友圈动态
router.get('/friendscircle',async (ctx,next)=>{
  const queryData =ctx.query
  console.log(queryData)
  
  let op=queryData.op
  if(op=='getCircle'){
    // 获取朋友圈数据
    let userId=JSON.parse(queryData.userId)

    async function getUserInfo(){
      // 得到用户信息
      let sql =`select m.id , m.realname, m.avatar , t.imageUrl from hs_sz_yi_member as m left join hs_sz_yi_friends_theme as t on m.id=t.userId where m.id=${userId}`

      let userList=await query(sql)

      return userList
    }

    async function getComment(post) {
      // 查询朋友圈评论表，获取评论
        let sql =` select commentId,commentName,commentText from hs_sz_yi_friends_circle_commemts where postId=${post.id}`
        let commentList= await query(sql)
        return commentList      
    }

    // 查询好友列表
    async function getFriends (){
      let sql = ` select uid , addid from hs_sz_yi_friend_succeed where uid = ${userId} or addid = ${userId} `
      let friendsList= await query(sql)
      return friendsList
    }

    async function getCircle() {

      // 得到好友id
      let friendsList= await getFriends()
      let friendsId=[]
      friendsList.forEach(v => {
        if(v.uid===userId){
          friendsId.push(v.addid)
        }else{
          friendsId.push(v.uid)          
        }
      });
      friendsId.push(userId)
      console.log(friendsId)
      let circleList=[]
      for(let friendId of friendsId){
        // 遍历好友id,查询朋友圈动态表，获取朋友圈动态
        let sql =` select c.*,m.realname,m.avatar from hs_sz_yi_friends_circle as c left join hs_sz_yi_member as m on c.uid=m.id where c.uid=${friendId} order by c.postTime desc `

        let circleItem=await query(sql)
        circleList.push(...circleItem)

      }

      console.log(circleList)  

      let newCircleList=[]
      for(let i=0;i<=circleList.length-1;i++){
        // 遍历朋友圈数据，添加评论和修改点赞人
        
        let likes=circleList[i].likes.split(',')
        likes=likes.filter(ele=>{return ele})//去除数组空值

        let comment=await getComment(circleList[i])//获取评论·
        
        let {imgUrl1,imgUrl2,imgUrl3} = circleList[i]

        let eachList=Object.assign({},circleList[i],{
          likes,
          comment,
          postimage:[
            imgUrl1,
            imgUrl2,
            imgUrl3
          ]
        })

        newCircleList.push(eachList)

      }
      
      // console.log(newCircleList)
      return newCircleList
    }



    let userList= await getUserInfo()

    let circleList= await getCircle()
    // console.log(circleList)
    ctx.body={
      status:1,
      result:{
        msg:'获取朋友圈数据成功！',
        userList,
        circleList
      }
    }
  }
})

// 更改朋友圈数据
router.post('/friendscircle',async (ctx,next)=>{
  const {op}=ctx.request.body
  if(op=='postLike'){
    // 如果是点赞
    console.log(ctx.request.body)
    let {postId,likeName,likes,suporthtml}=ctx.request.body
    // let flag=false;//判断是点赞还是取消,false为点赞

    // for(let i=likes.length-1;i>=0;i--){
      // console.log(likes[i],likeName)
    //   if(likes[i]==likeName){
    //     flag=true;//说明已经点赞，改为true，执行取消点赞
    //     likes.splice(i,1);
    //   }
    // }

    async function postLike(likeArr,suporthtml){
      let sql = `UPDATE hs_sz_yi_friends_circle SET likes='${likeArr}',suporthtml='${suporthtml}'
                WHERE id=${postId}`
      let arrList=await query(sql)
      return arrList
    }

    // if(flag){//取消点赞
      // let likeArr=likes.join(',')
      // console.log(likeArr)
      await postLike(likes,suporthtml).then(res=>{
        ctx.body={
          state:1,
          msg:'操作成功！'
        }
      })
    // }else{//点赞
    //   likes.push(likeName)
    //   let likeArr=likes.join(',')
    //   console.log(likeArr)
      
    //   await postLike(likeArr).then(res=>{
    //     ctx.body={
    //       state:1,
    //       msg:'取消点赞成功！'
    //     }
    //   })
    // }
    
  }else if(op=='postComment'){
    // 评论
    console.log(ctx.request.body)
    let {postId,commentId,commentName,commentText}=ctx.request.body

    async function postComment(postId,commentId,commentName,commentText){
      let sql = `insert into hs_sz_yi_friends_circle_commemts (id,postId,commentId,commentName,likes,commentText) values(null,${postId},${commentId},'${commentName}',0,'${commentText}')`
      let arrList=await query(sql)
      return arrList
    }
    
    await postComment(postId,commentId,commentName,commentText).then(res=>{
      ctx.body={
        state:1,
        msg:'评论成功！'
      }
    })
  }
})

// 发表朋友圈

//配置multer
const storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        // cb(null, 'public/images/')  //注意路径必须存在
        // 生成目标文件夹
        var destDir = 'public/images/';
        // var destDir = 'images/';

        // 判断文件夹是否存在
        fs.stat(destDir, (err) => {
            if (err) {
                // 创建文件夹
                mkdirp(destDir, (err) => {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, destDir);
                    }
                });
            } else {
                cb(null, destDir);
            }
        });
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

// 加载配置
const upload = multer(
  { storage }
);

router.post('/friendscircle/post',upload.array('imgsUrl'),async(ctx,next)=>{
  // 发表动态
  const queryData=ctx.req.body
  
  let {op}=queryData
  
  // 发表动态
  if(op=="postnews"){
    // 发表动态
    console.log(ctx.req.files)
    // 发表人id
    let userId=JSON.parse(queryData.userId)
    // 发表内容
    let postNews=queryData.postNews
    // 发表时间
    let postTime=Date.parse(new Date())/1000
    // 从请求数据中得到图片信息
    let imgsData=ctx.req.files
    // 保存图片路径
    let imgsUrl=[]
    
    // 从文件信息达到图片路径
    for (let imgItem of imgsData){
      imgsUrl.push(imgItem.filename)
    }

    // console.log(imgsUrl)
    for (let i=2;i>=0;i--){
      if(!imgsUrl[i]){
        imgsUrl[i]=''
      }
    }

    // let sql = `insert into hs_sz_yi_friends_circle (id,uid,text,imgUrl1,imgUrl2,imgUrl3,postTime) values('',${userId},'${postNews}','${imgsUrl[0]}','${imgsUrl[1]}','${imgsUrl[2]}',${postTime})`
    let sql = `insert into hs_sz_yi_friends_circle (id,uid,text,imgUrl1,imgUrl2,imgUrl3,postTime) values(null,${userId},'${postNews}','${imgsUrl[0]}','${imgsUrl[1]}','${imgsUrl[2]}',${postTime})`
    
    // 插入朋友圈动态数据
    await query(sql).then(res=>{
      ctx.body={
        status:1,
        result:{
          msg:'发表动态成功！',
          imgsUrl
        }
      }
    })

  }else if(op=="changeTheme"){
    // 更改主题图片
    const { userId } = queryData

    // 从请求数据中得到图片信息
    let imgsData = ctx.req.files[0]
    console.log(imgsData)
    // 查询用户是个已经设置主题图片
    async function checkTheme(){
      let sql =`select * from hs_sz_yi_friends_theme where userId=${userId} `
      let res=await query(sql)
      return res
    }

    // 插入主题图片信息
    async function changeTheme(params) {
      let checkRes=await checkTheme()
      console.log(checkRes)
      if(checkRes.length>0){
        // 如果主题图片已经存在，则更新数据
        let sql =`UPDATE hs_sz_yi_friends_theme SET imageUrl='${imgsData.filename}'
                WHERE userId=${userId}`
        let changeThemeRes=await query(sql)
        return changeThemeRes
      }else{
        // 否则主题图片不存在，则插入数据
        let sql =`insert into hs_sz_yi_friends_theme (id ,userId,imageUrl) values(null,${userId},'${imgsData.filename}')`
        let changeThemeRes=await query(sql)
        return changeThemeRes
      }
    }

    await changeTheme().then(res=>{
      ctx.body={
        status:1,
        result:{
          msg:'更换主题图片成功！'
          // imgsUrl
        }
      }
    })

  }

})

module.exports = router
