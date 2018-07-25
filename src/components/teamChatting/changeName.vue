<template>

  <transition name="slide-left">

    <div class="change-team-name">
      <header id="wx-header" >
          <div class="center flex flex-start">

              <div class="iconfont icon-return-arrow" @click="$router.back()">
                  <span>返回</span>
              </div>

              <span class="align-self-center flex-1">修改群名称</span>
              <span class="align-self-center " @click="confirmChangeTeamName">确认</span>
              
          </div>
      </header>
      
      <div class="weui-cells change-name flex flex-ver">

        <span>名称：</span>
        <input type="text" v-model="newTeamName" autofocus>

      </div>

    </div>

  </transition>

</template>

<script>
import { Toast } from 'mint-ui'
import {mapState, mapActions, mapMutations} from 'vuex'


  export default {
    name:'changeName',
    data(){
      return{
        searchValue:'',
        newTeamName:''
      }
    },
    computed:{
      ...mapState([
        "teamId","teamName"
      ])
    },
    mounted(){
      this.newTeamName=this.teamName
    },
    methods:{
      ...mapMutations([
          "getTeamName"
      ]),
      confirmChangeTeamName(){
        console.log(this.teamId)
        if(this.newTeamName===''){
          Toast({
            message: '群名称不能为空',
            duration: 2000
          });
          return;
        }
        this.axios({
          url:'/teamchat.html/Group/setting',
          method: 'post',
          data: {
            op:'changeName',
            TeamName: this.newTeamName,
            teamId:this.teamId
          }
        }).then(res=>{
          console.log(res)
          if(res.data.status===1){
            console.log(res)
            this.getTeamName(this.newTeamName)
            Toast({
              message: res.data.result.msg,
              duration: 2000
            });
            setTimeout(() => {
              this.$router.push({
                path:`/Group`
              })
            }, 2000);
            
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
