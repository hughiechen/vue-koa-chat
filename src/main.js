// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment';
// import Vuex from 'vuex';
import store from './vuex/'

import axios from 'axios'
import VueAxios from 'vue-axios'
import { Cell,Checklist, IndexList, IndexSection,Popup,Search } from 'mint-ui'
import getUrl from './common/js/getUrl'

import 'mint-ui/lib/style.css'

Vue.component(Cell.name, Cell);
Vue.component(Checklist.name, Checklist);
Vue.component(IndexList.name, IndexList);
Vue.component(IndexSection.name, IndexSection);
Vue.component(Popup.name, Popup);
Vue.component(Search.name, Search);

// 本地化，中文时间显示
moment.locale('zh-cn');

Vue.prototype.moment = moment;

Vue.prototype.random = n => Math.floor(n * Math.random());

Vue.prototype.$getUrl=getUrl 

// Vuex
// Vue.use(Vuex);

// axios
//在main.js设置全局的请求次数，请求的间隙
axios.defaults.timeout = 30000;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return axios(config);
    });
});


Vue.use(VueAxios, axios);

// const store = new Vuex.Store({
//   state: {
//     name: '',
//     avatarUrl:``,
//     addr: '',
//     isShowAbout: false,
//     userId:0
//   },

//   mutations: {
//     changeName(state, name) {
//       state.name = name;
//     },
//     setAvatarUrl(state, avatarUrl) {
//       state.avatarUrl = avatarUrl;
//     },
//     setAddr(state, addr) {
//       state.addr = addr;
//     },
//     showAbout(state, flag) {
//       state.isShowAbout = flag;
//     },
//     getUserId(state, userId){
//       state.userId = userId;
//     }
//   }

// });

// Vue.filter('timeFormat', function (value) {
//   if (!value) return ''
//     value=JSON.parse(value)
//     return this.moment(value).format('YYYY-MM-DD HH:mm:ss')
// })

// 页面title动态改变
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
