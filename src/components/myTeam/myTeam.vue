<template lang="html">

  <transition name="slide-top">

    <div class="myTeam">
      <div class="top-banner flex flex-between">
        <a href="javascript:;" class="back" @click="goBack">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fanhui"></use>
            </svg>
            <span>返回</span>
        </a>

        <a href="javascript:;" class="back" >群聊</a>

        <a href="javascript:;" class="back" @click="showMyfriend">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jia"></use>
            </svg>
        </a>
      </div>

      <div v-if="!showTeam" class="no-team">
          <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gantanhao"></use>
          </svg>
      </div>

      <div v-else class="has-team">
        <mt-index-list >
          <mt-index-section v-for="(team , index) in myteam" :key="index" index="">
            <mt-cell :title="team.teamName" :teamId="team.teamId" @click.native="gotoTeamChat(team.teamId,team.teamName,team.team_host_id)">
              <mt-badge size="normal" type="error" v-if="!team.readStatus">未读</mt-badge>
            </mt-cell>
          </mt-index-section>
        </mt-index-list>
      </div>
      
    </div>

  </transition>

</template>

<script>

import getCookie from '@/common/js/getCookie.js'

export default {
  props:{
    teamId:{
      default:0,
      type:Number
    }
  },
  name: 'myTeam',
  data() {
    return {
      name: '',
      myteam:[],
      showTeam:false,
      avatarUrl:''
    }
  },
  computed: {
    isShowAbout() {
      return this.$store.state.isShowAbout;
    }
  },
  methods: {

    // 页面加载用户信息，群信息
    login() {

      // if (this.name === '') {
      //   return;
      // }

      // this.$store.commit('changeName', this.name);
      // localStorage.name = this.name;
      // this.$router.push('Chatting');
      this.getUserId()

    },

    // 获取群组信息
    getUserInfo(userId){
      this.axios
        .get('/teamchat.html/myTeam')
          .then(res=>{
            if(res.data.status === 1){
              if(res.data.result.length!==0){
                console.log(res)
                this.myteam=res.data.result
                this.name=res.data.result[0].realname
                this.avatarUrl=res.data.result[0].avatar
                this.$store.commit('changeName',this.name)
                this.$store.commit('setAvatarUrl',this.avatarUrl)                
                localStorage.name = this.name;
                this.showTeam=!this.showTeam
              }
            }
        })
    },

    // 跳转群聊组
    gotoTeamChat(teamId,teamName,team_host_id){
      console.log(teamId,team_host_id)
      this.$store.commit('getTeamId',teamId)
      this.$store.commit('getTeamName',teamName)                
      this.$store.commit('getTeamHostId',team_host_id)  

      // 改变群消息是否已读状态            
      this.axios
        .get('/teamchat.html/myTeam/changeReadStatus',
          {
            params:{
              teamId,
              userId:this.$store.state.userId
            }
          }
        ).then(res=>{
          console.log("已读！")
      })

      this.$router.push({
        name:`Group`,
        params:{
          teamId
        }
      })
    },

    // 跳转好友页面
    showMyfriend(){

      this.$router.push({
        path:`/inviteMyfriend`
      });

    },
    // 删除cookie
    delCookie (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    // 获取用户id，并请求用户数据
    getUserId(){
      const id=getCookie('userId');      
      this.$store.commit('getUserId', id);
      console.log(id)  
      this.getUserInfo(id)
    },
    goBack(){

      this.delCookie('userId')

      window.location.href="http://suphhk.com/app/index.php?i=1&c=entry&p=myfriend&do=member&m=sz_yi"

    }
  },
  created() {
    this.login()
  },
}
</script>

<style lang="scss" scoped>

.myTeam{
  .top-banner{
    height:3rem;
    padding:0 1rem;
    line-height: 3rem;
    background: #373B3E;
    .back{
      display:block;
      height:100%;
      font-size:1rem;
      padding: 0 .5rem;
      color: white;
    }
  }
  .no-team{
    font-size:5rem;
    text-align:center;
  }
}

</style>
