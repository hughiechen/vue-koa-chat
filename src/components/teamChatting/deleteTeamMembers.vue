<template>

  <transition name="slide-left">

    <div class="change-team-name">
      <header id="wx-header" >
          <div class="center flex flex-start">

              <div class="iconfont icon-return-arrow" @click="$router.back()">
                  <span>返回</span>
              </div>

              <span class="align-self-center flex-1">删除成员</span>
              <span class="align-self-center " @click="confirmDelete">确认</span>
              
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
    name:'deleteTeamMembers',
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
        return this.$store.state.teamId       
      },
      userId(){
        return this.$store.state.userId
      }
    },
    mounted(){
      this.getMembers()
    },
    methods:{

      confirmDelete(){

        if(this.chosenFriends.length<=0){
          Toast({
            message: '请选择成员',
            duration: 2000
          });
          return false;           
        }
        const chosenFriends=JSON.stringify(this.chosenFriends);

        const requestData={
          op:'deleteMembers', 
          teamId:this.teamId,                   
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
              message: res.data.result.msg,
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

      getMembers(){
        this.axios
              .get('/teamchat.html/Group/setting',
              {
                params:{
                  teamId:this.teamId
                }
              }
            ).then(res=>{

              if(res.data.status===1){
                console.log(res)
                res.data.result.teamMembers.forEach(v=>{
                  if(v.member_id===JSON.parse(this.userId)){
                    return false;
                  }
                  this.options.push({
                    label: v.realname,
                    value: v.member_id
                  }) 
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

