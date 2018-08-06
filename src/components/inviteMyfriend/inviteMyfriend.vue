<template>
  <transition name="slide-left">
    <div class="inviteMyfriend">
      <div class="top-banner flex flex-between">

        <a href="javascript:;" class="back" @click="$router.push('/')">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fanhui"></use>
            </svg>
            <span>我的群聊</span>
        </a>

        <a href="javascript:;" class="back" >选择群成员</a>

        <a href="javascript:;" class="back" @click="confirmInvite(userId)">确定</a>

      </div>

      <a class="search-friend flex flex-ver" href="http://suphhk.com/app/index.php?i=1&c=entry&p=nfriends&do=member&m=sz_yi">
        <input type="text" class="search-friend-input flex-1" placeholder="搜索" readonly/>
      </a>

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
  import {mapState, mapActions, mapMutations} from 'vuex'
  
  import Qs from 'qs'
  export default {
    name:'inviteMyfriend',
    data(){
      return {
        chosenFriends:[],
        options:[
          // {
          //   label: 'optionA',
          //   value: 'valueA'
          // }
        ],
        userId:''
      }
    },
    methods:{
      ...mapMutations([
          "getTeamId","getTeamName"
      ]),
      confirmInvite(userId){

        console.log(userId)

        console.log(this.chosenFriends)

        if(this.chosenFriends.length<=0){
          Toast({
            message: '请选择好友',
            duration: 2000
          });
          return;
        }

        const chosenFriends=JSON.stringify(this.chosenFriends);

        const requestData={
          team_host_id:userId,
          member_id:chosenFriends
        }

        // 发送群好友信息
        this.axios.get('/teamchat.html/inviteMyfriend/join',
          {params:requestData}
        )
        .then(res=>{
            if(res.data.status===1){
              const {teamId,teamName}=res.data.result
              console.log(res,teamId,teamName)

              Toast({
                message: res.data.result.msg,
                duration: 2000
              });
              this.getTeamId(teamId)
              this.getTeamName(teamName)
              setTimeout(() => {
                this.$router.push({
                  path:`/Group`
                })
              }, 2000);
            }
        })

      },
      getMyfriend(userId){
        this.axios.get(`/teamchat.html/inviteMyfriend`,
          {
            params:{userId}
          }
        ).then(res=>{
          console.log(res)
          if(res.data.status===1){
            res.data.result.forEach(v=>{
              if(v.addid==userId){
                this.options.push({
                  label: v.realname,
                  value: v.uid
                }) 
              }else if(v.uid==userId){
                this.options.push({
                  label: v.addname,
                  value: v.addid
                })
              }
            })         
          }
        })
      }
    },
    created() {
      const userId=this.$store.state.userId;
      console.log(userId)
      this.userId=userId
      if(!userId){
        this.$router.push('/');
        return;
      }
      this.getMyfriend(userId)
      
    }
  }
</script>
<style lang="scss" scoped>
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.inviteMyfriend{
  background: #F5F5FA;
  .top-banner{
    height:3rem;
    padding:0 1rem;
    line-height: 3rem;
    background:#373B3E;
    .back{
      display:block;
      height:100%;
      font-size:1rem;
      padding: 0 .5rem;
      color:white;
    }
  }
  .search-friend{
    height: 3.5rem;
    box-sizing: border-box;
    padding:.5rem;
    .search-friend-input{
      height: 100%;
      padding-left: .5rem;
      text-align: center;
    }
  }
}
</style>
