<template>

  <transition name="slide-right">
    <div class="chatting">

      <!-- 聊天界面头部 -->
      <div class="chatting-header">
        <a href="javascript:;" class="back align-self" @click="$router.push('/')">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fanhui"></use>
            </svg>
        </a>

        <div class="chatting-title">
          <h2>{{teamName}}</h2>
        </div>

        <div class="chatting-menu">
          <i @click="gotoSetting" class="icon-group"></i>
        </div>
        
      </div>

      <!-- 聊天内容区域 -->
      <div @click.stop.prevent="isShowEmoji=false" ref="chattingContent" class="chatting-content">

        <div v-for="(item, index) in msgs" v-if="item.teamId == teamId " v-bind:key="index">
          <div v-if="item.self" class="chatting-item self clearfix">
            <div class="msg-date">
              {{ item.date }}
            </div>
            <div class="msg-from">
              <span class="loc">[{{item.loc}}]</span>
              <span class="msg-author">{{ item.from}}</span>
              <img :src="item.avatarUrl" alt="">
            </div>
            <!-- <div class="msg-content">{{ item.content }}</div> -->
            <div class="msg-content" v-if="!item.img">{{item.content}}</div>
            <div class="msg-content" v-else>
              <img :src="item.img" alt="" class="msg-img">
            </div>
            
          </div>

          <div v-else class="chatting-item other clearfix">

            <div class="msg-date">
              {{ item.date }}
            </div>
            <div class="msg-from">
              <img :src="item.avatarUrl" alt="">
              <span class="loc">[{{item.loc}}]</span>
              <span class="msg-author">{{ item.from }}</span>
            </div>
            
            <div class="msg-content" v-if="!item.img">{{item.content}}</div>
            
            <div class="msg-content" v-else>
              <img :src="item.img" alt="" class="msg-img">
            </div>
            
          </div>

        </div>

        <!-- <div class="online">
          microzz上线了
        </div> -->

      </div>

      <!-- 输入区域 -->
      <div class="chatting-input " :class="{input_content_slide:clickmore}">

        <transition name="slide-bottom">
          <div v-show="isShowEmoji" class="emoji-display">
            <ul>
              <li v-bind:key='index' @click="insertText(item)" v-for="(item, index) in  emojis">{{item}}</li>
            </ul>
          </div>
        </transition>

        <div class="emoji">
          <i @click="showEmoji(isShowEmoji=!isShowEmoji);" class="icon-emoji "></i>
        </div>

        <textarea @keyup.enter="send" @input="newLine" ref="textarea" v-model.trim="inputContent" placeholder="" @click="inputBottomHide">
        </textarea>
        <button @click="send" v-if="light">发送</button>
        <svg class="icon icon-jia" aria-hidden="true" v-else @click="bottomShow">
          <use xlink:href="#icon-jia"></use>
        </svg>
        
      </div>
						<!-- <img :src="newImg" id="imgSrc" ref="imgSrc" class="imgSrc"  />           -->
      <!-- <div id="container">
      </div> -->
      <!-- <footer :class=" {footshow : clickmore}">
			<section class="foot_top"> -->
				<!-- <div>
					<svg>
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#voice"></use>
					</svg>
				</div>
				<div>
					<input type="text" v-model="inputmessage" maxlength="100"  @input="whatInput" @click="inputBottomHide" :class="{lightborder : light}" @keyup.enter="enterThing">
				</div>
				<div>
					<svg>
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#face"></use>
					</svg>
				</div>
				<div>
					<div class="send" v-if="light" @click="clickSend">
						<span>发送</span>
					</div>
					<svg v-else @click="bottomShow">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#addthing"></use>
					</svg>
				</div> -->
      			<!-- </section> -->
    <footer :class=" {footshow : clickmore}">
			 <section class="foot_bottom">
	    		<div class="swiper-container">
			        <div class="swiper-wrapper">
			            <div class="swiper-slide" v-for="(item,index) in chatData" :key="index">
		            		<ul class="clear" >
		            			<li v-for="(value,vIndex) in item" :key="vIndex" @click="clickMoreOptions(vIndex)" >
		            				<div class="swiper_svg" >
			            				<!-- <svg fill="#7a8187">
			            					<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="value.chatSvgid"></use>
			            				</svg> -->
                          <svg class="icon icon-jia" aria-hidden="true">
                            <use :xlink:href="value.chatSvgid"></use>
                          </svg>

                          <!-- <input type="file" class="coverfile" id="input_file" @change="uploadPreview"/> -->

                          <input v-if="vIndex===0" id="inputFile" class="coverfile" name='inputFile' type='file' multiple='mutiple' accept="image/*;capture=camera"
                          style="display: none" @change="fileup">
		            				</div>
		            				<div class="swiper_text">
		            					{{value.chatSvgname}}
		            				</div>
		            			</li>
		            		</ul>
			            </div>
			        </div>
			        <div class="swiper-pagination"></div>
			    </div>
			</section>
		</footer>
    
    </div>
  </transition>

</template>
<script>
	// import {animate} from '@/config/mUtils' 
	// import ImgPrevirewer from '@/config/imgUpload.js' 
	import {imgurl} from '@/config/env';

	import {groupChat, chatData, getHistory} from '@/service/getData';  

	import {mapState, mapActions, mapMutations} from 'vuex'

	import '@/common/style/swiper.min.css'

  export default {
    name: 'Group',
    data(){
      return {
        msgs: localStorage.msgs_group && JSON.parse(localStorage.msgs_group) || [],
        inputContent: '',
        oContent: {},
        oTextarea: {},
        emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '⚱', '😜', '😎', '😊', '😳', '😱', '😒', '😔', '😷', '👿', '😩', '🎃','😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳','😢'],
        isShowEmoji: false,
        isRedAI: false,
				light:false,		//输入框不为空时
				clickmore:false,	//点击加号底部显示、隐藏        
				chatData:{}
      }
    },
    watch: {
      msgs(val) {
        localStorage.msgs_group = JSON.stringify(val);
      }
    },
    computed: {

      ...mapState([
				"newImg", "userInfo", "imagestatus","teamName","name","avatarUrl","teamId"
			])
      
    },
    // beforeRouteEnter(to, from, next) {
    //   if (!localStorage.name) {
    //     next('/')
    //   } else {
    //     next();
    //   }
    // },
    mounted() {
      console.log(this.teamId)
      // this.teamId=this.$route.params.teamId
      // setInterval(() => this.isRedAI = !this.isRedAI, 2500);
      this.oContent = document.querySelector('.chatting-content');
      this.oContent.scrollTop = this.oContent.scrollHeight;
      this.oTextarea = document.querySelector('textarea');

      socket.emit('join',this.teamId)
      
      socket.emit('online', this.$store.state.name);

      socket.on('online', (name) => {

        if (!name) {
          return;
        }

        let oOnline = document.createElement('div');
        oOnline.className = 'online';
        oOnline.innerText = name + '上线了';
        this.oContent.appendChild(oOnline);
        this.oContent.scrollTop = this.oContent.scrollHeight;


      });

      // 接收群聊消息
      socket.on('receiveGroupMsg', (data , roomID) => {
        console.log(data)
        this.msgs.push(data);
        setTimeout(() => {
          this.oContent.scrollTop = this.oContent.scrollHeight;
        }, 0);
      });

      this.oContent.scrollTop = this.oContent.scrollHeight;

      chatData().then((res) => {
				this.chatData=res;
			}).then(()=>{
				//初始化swiper
				new Swiper('.swiper-container', {
			        pagination: '.swiper-pagination',
			        loop: false,
			    });
        })

    },
    methods: {
      ...mapMutations([
          "SAVE_THEMIMG", "SAVE_MESSAGE",
      ]),
      ...mapActions([
        "getUserInfo",
      ]),
      // uploadPreview(){
        //上传图片并展示图片（无剪裁功能）
        // new uploadPreview({
        //   UpBtn: "input_file",
        //   ImgShow: "imgSrc",
        //   ImgType:["gif", "jpeg", "jpg", "bmp", "png"],
        //   callback:(res)=>{
        //     // this.afterclcik=true;
        //     this.newImg=this.$refs.imgSrc.src
        //     console.log(this.newImg)
            
        //     this.SAVE_THEMIMG({newImg:this.$refs.imgSrc.src,imagestatus:true})
        //   }
        // });
        // var config = {
        //     tip: "请上传格式为png, gif或者jpg的图片",
        //     fileId: "input_file",
        //     containerId: "container",
        //     imgStyle: "width:320px;height:auto;border-radius:64%;"
        // }
        // var previewer = new ImgPrevirewer(config);
        // previewer.preview();

      // },
			bottomShow(){
				this.clickmore=true;
			},
			bottomHide(){
				this.clickmore=false;
			},
			inputBottomHide(){
				this.clickmore=false;
			},
      send() {
        this.isShowEmoji = false;
        this.light=!this.light
        if (this.inputContent === '') {
          return;
        } else {
          socket.emit('sendGroupMsg', {
            date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
            loc: localStorage.addr,
            from: `${localStorage.name}`,
            content: this.inputContent,
            avatarUrl: this.avatarUrl,
            teamId:this.teamId
          },this.teamId);

          this.msgs.push({
              date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
              loc: localStorage.addr,
              from: `${localStorage.name}`,
              content: this.inputContent,
              self: true,
              avatarUrl: this.avatarUrl,
              teamId:this.teamId
          });
          this.inputContent = '';
          setTimeout(() => this.oContent.scrollTop = this.oContent.scrollHeight, 0);
        };
      },

      showEmoji(flag) {
        this.isShowEmoji = flag;
      },

      insertText(str) {
        str = str + ` `;
        const oTextarea = this.$refs.textarea;

        if (document.selection) {

          let sel = document.selection.createRange();

          sel.text = str;

        } else if (typeof oTextarea.selectionStart === 'number' && typeof oTextarea.selectionEnd ==='number') {

          let startPos = oTextarea.selectionStart;
          let endPos = oTextarea.selectionEnd;
          let cursorPos = startPos;
          let tempVal = oTextarea.value;
          this.inputContent = tempVal.substring(0, startPos) + str + tempVal.substring(startPos, tempVal.length)
          cursorPos += str.length;
          oTextarea.selectionStart = oTextarea.selectionEnd = cursorPos;

        } else {
          oTextarea.value += str;
        }
        this.newLine();
      },

      newLine() {
        setTimeout(() => this.oTextarea.scrollTop = this.oTextarea.scrollHeight, 0);
        console.log(11)
        if(this.inputContent.replace(/\s+/g, "") == ''){
					this.light=false;
				}else{
					this.light=true;
				}
      },

      // 图片上传
      fileup() {
        
        const that = this
        const file1 = document.getElementById('inputFile').files[0]
        if (file1) {
          // const formdata = new window.FormData()
          // formdata.append('file', file1)
          // formdata.append('username', getItem('userid'))
          // formdata.append('src', getItem('src'))
          // formdata.append('roomid', that.roomid)
          // formdata.append('time', new Date())
          // this.$store.dispatch('uploadImg', formdata)
          const fr = new window.FileReader()
          fr.onload = function () {
          // console.log(fr.readAsDataURL(file1))
              
              // console.log(fr.result)
              // const obj = {
              //   username: getItem('userid'),
              //   src: getItem('src'),
              //   img: fr.result,
              //   msg: '',
              //   room: that.roomid,
              //   time: new Date()
              // }
            // that.getSocket.emit('message', obj)
            socket.emit('sendGroupMsg', {
              date: that.moment().format('YYYY-MM-DD HH:mm:ss'),
              loc: localStorage.addr,
              from: `${localStorage.name}`,
              content: that.inputContent,
              avatarUrl: that.avatarUrl,
              teamId:that.teamId,
              img:fr.result
            },that.teamId)
 
            that.msgs.push({
              date: that.moment().format('YYYY-MM-DD HH:mm:ss'),
              loc: localStorage.addr,
              from: `${localStorage.name}`,
              content: that.inputContent,
              self: true,
              avatarUrl: that.avatarUrl,
              teamId:that.teamId,
              img:fr.result
            });
          }
          

          
          that.inputContent = '';
          fr.readAsDataURL(file1)
          // this.$nextTick(() => {
          //   this.container.scrollTop = 10000
          // })
          this.bottomHide()
          setTimeout(() => this.oContent.scrollTop = this.oContent.scrollHeight, 0);
          
        } else {
          console.log('必须有文件')
        }
      },
      clickMoreOptions(v) {
        if(v===0){
          this.addPhoto()
        }
      },
      addPhoto(){
        const file = document.getElementById('inputFile')
        file.click()
      },
      gotoSetting(){

        const teamId=this.teamId

        this.$router.push({
          name:`setting`,
          params:{
            teamId
          }
        })

      }
    }
  }
</script>
<style lang="scss" scoped>
	@import "../../common/style/public";

  $blue: #2196f3;
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .imgSrc{
    display:block;
    position:absolute;
    top:0;
    z-index:4;
    width:100%;
    height:11.3706666667rem;
  }
  .chatting {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .chatting-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      width: 100%;
      position:fixed;
      top:0;
      background-color: $blue;
      color: white;
      padding-left: 10px;
      padding-right: 15px;
      .back{
        display:block;
        height:100%;
        font-size:1.1rem;
        padding: 0 .5rem;
        color:grey;
        line-height: 50px;
      }
      .chatting-back {
        width: 32px;
        height: 32px;
        .icon-back {
          background: url('../../common/icons/icon-ai.svg') no-repeat;
          background-size: contain;
        }
        .icon-back2 {
          background: url('../../common/icons/icon-ai2.svg') no-repeat;
          background-size: contain;
        }
      }

      .chatting-title {
        i.icon-group {
          vertical-align: top;
          width: 30px;
          height: 30px;
          background: url('../../common/icons/icon-group.svg') no-repeat;
          background-size: contain;
          margin-right: 3px;
        }
        h2{
          color:white;
        }
      }

      .chatting-menu {
        width: 30px;
        height: 30px;
        // i.icon-menu {
        //   background: url('../../common/icons/icon-index.svg') no-repeat;
        //   background-size: contain;
        // }
        i.icon-group {
          background: url('../../common/icons/icon-group.svg') no-repeat;
          background-size: contain;
        }
      }
    }

    .chatting-content {
      flex: 1;
      width: 100%;
      background-color: rgba(0, 0, 0, .1);
      overflow: auto;
      padding:46px 0;
      .chatting-item {
        padding: 10px;
        width: 100%;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 80%;
        }
        .msg-from {
          display: flex;
          align-items: center;
          span.loc {
            color: gray;
            font-size: 60%;
            margin-right: 5px;
          }
          .msg-author {
            font-size: 1.2rem;
          }
          img {
            width: 30px;
            height: 30px;
            border-radius: 15px;
          }
        }
        .msg-content {
          margin-top: 5px;
          background-color: white;
          width:auto;
          padding: 6px 10px;
          border-radius: 10px;
        }
      }

      .chatting-item + .chatting-item {
        margin-top: 10px;
      }
      .self {
        .msg-from {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          img {
            margin-left: 10px;
          }
        }

        .msg-content {
          float: right;
          word-wrap: break-word;
          word-break: break-all;
          margin-right: 10px;
          .msg-img{
            width:100%;
            height:100%;
            display:block;
          }
        }


      }

      .other {
        .msg-from {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span.loc {
            color: gray;
            font-size: 60%;
            margin-right: 5px;
          }
          img {
            margin-right: 10px;
          }
        }

        .msg-content {
          float: left;
          margin-left: 10px;
          word-wrap: break-word;
          word-break: break-all;
          .msg-img{
            width:100%;
            height:100%;
            display:block;
          }
        }

      }

      .online {
        width: 200px;
        // max-width: 100%;
        margin: 3px auto;
        border-radius: 4px;
        text-align: center;
        background-color: #FFFDE7;
      }


    }

    .chatting-input {
      position: fixed;
      bottom:0;
      display: flex;
      height: 46px;
      width: 100%;
      background: #f5f5f5;
      .emoji-display {
        position: absolute;
        width: 100%;
        height: 210px;
        background-color: white;
        top: -210px;
        left: 0;
        overflow-y: auto;
        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            padding: 2px 3px;
            font-size: 2.2rem;
          }
        }
      }
      .emoji {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 100%;
        background-color: rgba(0, 0, 0, .1);
        .icon-emoji {
          width: 40px;
          height: 100%;
          background: url('../../common/icons/icon-emoji.svg') no-repeat;
          background-size: 100% 100%;
        }
        
      }

      textarea {
        flex: 1;
        resize: none;
        padding-left: 3px;
        padding-top: 7px;
        padding-right: 3px;
        height: 100%;
        font-size: 1.4rem;
      }
      button {
        width: 60px;
        height: 100%;
        background-color: $blue;
        color: white;
        font-size: 16px;
      }

      .icon-jia{
        width:3rem;
        height:3rem;
      }
    }
  }

  .footshow{
		bottom:0;
		transition: all .2s;
	}

	footer{
		position: fixed;
		z-index:10;
		border-top:1px solid #e0e0e0;
		background:#f5f5f5;
		bottom:-11.712rem;
		width:100%;
		.foot_top{
			padding:0 0.512rem;
			height:2.0053333333rem;
			background:#f3f3f3;
			@include justify(flex-start);
			align-items:center;
			div:nth-of-type(1),div:nth-of-type(3),div:nth-of-type(4){
				@include widthHeight(1.3653333333rem,1.3653333333rem);
				margin-right:0.3413333333rem;
				svg{
					@include widthHeight(100%, 100%);
				}
			}
			div:nth-of-type(2){
				margin-right:0.3413333333rem;
				width:9.8rem;
				height:1.152rem;
				border-bottom:1px solid #e0e0e0;
				input{
					display:block;
					width:9.8rem;
					padding:0 0.4133333333rem;
					line-height:1.152rem;
					height:1.152rem;
					border:0;
					background:none;
					@include sizeColor(0.64rem,#000);
					border-bottom:1px solid #e0e0e0;
				}
				.lightborder{
					border-color:#19ad17;
				}
			}
			div:nth-of-type(4){
				margin-right:0;
				.send{
					width:1.8133333333rem;
					background:#16af17;
					height:1.3653333333rem;
					padding:.682666rem 0;
					border-radius:5px;
					@include justify(center);
					align-items:center;
					span{
						display:block;
						@include sizeColor(0.5973333333rem,#fff);
					}
				}
				.send:active{
					background:#33c034;
				}
			}
		}
		.foot_bottom{
			height:11.712rem;
			border-top:1px solid #e0e0e0;
			.swiper-container{
				width:100%;
				height:11.712rem;
				overflow:hidden;
				.swiper-slide{
					width:100%;
					ul{
						padding:1.408rem 1.1946666667rem 0;
						box-sizing:border-box;
            display: flex;
						li{
							// float:left;
							// width:2.5466666667rem;
              width:25%;
							// margin-right:1rem;
							margin-bottom:1.1946666667rem;
							.swiper_svg{
								@include widthHeight(3.5466666667rem,3.5466666667rem);
								background:#fcfcfc;
								border:1px solid #d3d3d3;
								border-radius:10px;
                margin:0 auto;
								@include justify(center);
								align-items:center;
								svg{
									@include widthHeight(4.28rem,2.3386666667rem);
									display:block;
								}
                position:relative;
							}
							.swiper_text{
								width:100%;
								margin-top:0.256rem;
								text-align:center;
								@include sizeColor(0.4693333333rem,#7a8187);
							}
						}
						li:nth-of-type(4n+4){
							margin-right:0;
						}
					}
				}
			}

      .coverfile{
        position: absolute;
        display:block;
        top:0;
        left:0;
        width:100%;
        height:100%;
        opacity:0;
      }
		}
	}

  .input_content_slide{
    transform: translateY(-11.712rem);
    transition: all .2s;
  }

  @-webkit-keyframes fadeIn {
	  from {
	    opacity: 0;
	  }
	  100% {
	    opacity: 1;
	  }
	}
	@keyframes fadeIn {
	  from {
	    opacity: 0;
	  }
	  100% {
	    opacity: 1;
	  }
	}
	@-webkit-keyframes zoomOut {
	  from {
	    opacity: 1;
	  }
	  50% {
	    opacity: 0;
	    -webkit-transform: scale3d(.3, .3, .3);
	    transform: scale3d(.3, .3, .3);
	  }
	  100% {
	    opacity: 0;
	  }
	}
	@keyframes zoomOut {
	  from {
	    opacity: 1;
	  }
	  50% {
	    opacity: 0;
	    -webkit-transform: scale3d(.3, .3, .3);
	    transform: scale3d(.3, .3, .3);
	  }
	  100% {
	    opacity: 0;
	  }
	}
</style>

              
