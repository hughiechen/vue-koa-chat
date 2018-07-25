<template>

  <transition name="slide-left">

    <div class="change-team-name">
      <header id="wx-header" >
          <div class="center flex flex-start">

              <div class="iconfont icon-return-arrow" @click="$router.back()">
                  <span>返回</span>
              </div>

              <span class="align-self-center flex-1">邀请好友</span>
              <span class="align-self-center " @click="confirmInvite">确认</span>
              
          </div>
      </header>
      
      <div class="myfriend-list">
        <mt-checklist
          v-model="chosenFriends"
          :options="options">
        </mt-checklist>
      </div>
      
    </div>

  </transition>

</template>

<script>

  import { Toast } from 'mint-ui'

  export default {
    name:'inviteNewFriends',
    data(){
      return{
        searchValue:'',
        chosenFriends:[],
        options:[]
        
      }
    },
    computed:{
      teamId()
      {
        return JSON.parse(this.$store.state.teamId)
      },
      userId(){
        return JSON.parse(this.$store.state.userId)
      }
    },
    mounted(){
      this.getMyfriends()
    },
    methods:{

      confirmInvite(){

        if(this.chosenFriends.length<=0){
          Toast({
            message: '请选择好友',
            duration: 2000
          });
          return false;           
        }
        const chosenFriends=JSON.stringify(this.chosenFriends);

        const requestData={
          op:'inviteNewFriend', 
          teamId:this.teamId,                   
          team_host_id:this.userId,
          member_id:chosenFriends
        }

        this.axios({
          url:'/teamchat.html/Group/setting',
          method: 'post',
          data:requestData
        }).then(res=>{
          if(res.data.status===1){
            console.log(res)
            Toast({
              message: '邀请好友成功！',
              icon:'success',
              duration: 2000
            });
            setTimeout(() => {
              this.$router.push({
                path:`/Group`
              })
            }, 2000);
            
          }
        })
      },

      getMyfriends(){
        this.axios({
          url:`/teamchat.html/Group/setting`,
          method:'post',
          data: {
            op:'getMyfriends',
            teamId:this.teamId,
            userId:this.userId
          }
        }).then(res=>{
          if(res.data.status===1){
            console.log(res)
            res.data.result.checkFriendslist.forEach(v=>{
              if(v.addid==this.userId){
                this.options.push({
                  label: v.realname,
                  value: v.uid
                }) 
              }else if(v.uid==this.userId){
                this.options.push({
                  label: v.addname,
                  value: v.addid
                })
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    .icon-jia{
      width:3em;
      height:3em;
    }
    #wx-header{
        position: relative;
        z-index: 99;
        height: 45px;
        padding: 0 15px 0 10px;
        line-height: 45px;
        background: #1b1b1b;
        opacity: 1;
        color: #fff;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-select: none;
        transition: all .3s linear;
        
        .center{
            width:100%;
            .align-self-center{
                text-align: center;
            }
        }
    }
    .dialogue-info {
        min-height: 100%;
        bottom: inherit;
        padding-bottom: 30px;
    }
    
    .chat-dialogue-entry-collect {
        background-color: #fff;
        position: relative;
        padding: 15px 10px 5px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        color: #464646;
        font-size: 14px;
    }
    
    .chat-dialogue-entry-collect:before {
        content: "";
        position: absolute;
        width: 200%;
        left: 0;
        bottom: 0;
        transform: scale(.5);
        transform-origin: 0 0;
        -webkit-transform: scale(.5);
        -webkit-transform-origin: 0 0;
        background-color: #b7b7b7;
        height: 1px;
        z-index: 2;
    }
    
    .chat-dialogue-entry-collect li {
        float: left;
        flex-grow: 1;
        flex-basis: 25%;
        max-width: 25%;
        padding: 5px 10px;
        text-align: center;
    }
    
    .chat-dialogue-entry-collect li>div {
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        width: 55px;
        height: 55px;
        margin: 0 auto;
        background-size: cover;
        border: 1px solid #eee;
    }
    
    .chat-dialogue-entry-collect li>div img {
        width: 100%;
    }
    
    .chat-dialogue-entry-collect li p {
        margin-top: 5px;
    }
    
    .chat-dialogue-entry-collect li .iconfont {
        font-size: 23px;
        color: #bbb;
        line-height: 55px
    }
    .change-team-name{
      .change-name{
        margin:15px 0;
        height: 40px;
      }
    }
</style>

