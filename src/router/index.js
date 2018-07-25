import Vue from 'vue'
import Router from 'vue-router'
import myTeam from '../components/myTeam/myTeam.vue';
import Login from '../components/Login/Login.vue';

import inviteMyfriend from '../components/inviteMyfriend/inviteMyfriend.vue';
import teamChatting from '../components/teamChatting/teamChatting.vue';
import AI from '../components/teamChatting/AI.vue';
import Group from '../components/teamChatting/Group.vue';
import setting from '../components/teamChatting/setting.vue';
import changeName from '../components/teamChatting/changeName.vue'
import inviteNewFriends from '../components/teamChatting/inviteNewFriends.vue'
import deleteTeamMembers from '../components/teamChatting/deleteTeamMembers.vue'

import friendsCircle from '../components/friendsCircle/friendsCircle.vue';
import postNews from '../components/friendsCircle/postNews.vue';

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path: '/',
      name: 'myTeam',
      component: myTeam,
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/inviteMyfriend',
      name: 'inviteMyfriend',
      component: inviteMyfriend,
    },
    {
      path: '/teamChatting',
      name: 'teamChatting',
      component: teamChatting,
      // beforeEnter: (to, from, next) => {
      //   console.log('router', Math.random());
      //   next();
      // }
    },
    {
      path: '/AI',
      name: 'AI',
      component: AI,
    },
    {
      path: '/Group',
      name: 'Group',
      component: Group,
      // children:[
      //   {
      //     path:'setting',
      //     name:'setting',
      //     component:setting 
      //   }
      // ]
    },
    {
      path:'/Group/setting',
      name:'setting',
      component: setting
    },
    {
      path:'/Group/setting/changeName',
      name:'changeName',
      component: changeName
    },
    {
      path:'/Group/setting/inviteNewFriends',
      name:'inviteNewFriends',
      component: inviteNewFriends
    },
    {
      path:'/Group/setting/deleteTeamMembers',
      name:'deleteTeamMembers',
      component: deleteTeamMembers
    },
    {
      path:'/friendsCircle',
      name:'friendsCircle',
      component:friendsCircle,
      meta: {
          title: '云粉圈'
      }
    },
    {
      path:'/friendsCircle/postNews',
      name:'postNews',
      component: postNews,
      meta: {
          title: '云粉圈'
      }
    },
  ]
});

export default router;
