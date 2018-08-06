<template>
	<section class="child_page">
		<head-top crossover="朋友圈" :canIpost="userId === hostId" clickrefresh="friendcicle" @refreshPage="freshPage"></head-top>
		
		<section class="friend_wipe" ref="friend">
			<section class="friend">

				<!-- 头部壁纸 -->
				<div class="theme">
					<div class="themeinit" @click="exportInput"></div>
					<div :class="{shoowimg : !imagestatus}" @click="exportInput">
						<img :src="newImg" id="imgSrc" ref="imgSrc" class="imgSrc"  />
					</div>
					<div v-if="userId === hostId" class="themetext" :class="{shoowimg : imagestatus}">轻触更换主题照片</div>
					<div class="personImg">
						<div class="personame">
							{{userInfoData.realname}}
						</div>
						<div class="headimg" @click="personCircle">
							<img :src="userInfoData.avatar" alt="">
						</div>
					</div>
				</div>

				<div v-if="userId === hostId" class="coverinput" :class="{shoowinput : afterclcik}">
					<div class="coverinputbg" @click="hideIput"></div>
					<div class="coverfiletext" >
						<div class="wipeinput" >
							更换相册封面
							<input type="file" class="coverfile" id="input_file" @change="themeUp"/>
						</div>
					</div>
				</div>

				<!-- 朋友圈动态 -->
				<div class="condition">
					<ul>
						<li class="condition_li" v-for="(item,index) in circleData" :key="index">
							<div class="condition_left">
								<img :src="item.avatar" alt="">
							</div>
							<div class="condition_right flex-1">
								<h1>{{item.realname}}</h1>
								<div class="publishtext">
									{{item.text}}
								</div> 
								<div class="publishimg clear" v-show="item.postimage.length>0">
									<img v-if="value" :src="'./images/'+value" alt="" v-for="(value,imgIndex) in item.postimage" :class="{releaseimg : item.postimage.length >= 2 ? true : false}" :key="imgIndex" v-gallery:index />
								</div>
								<div class="commentbutton">
									<div class="button_left clear">
										<!-- <span>{{item.postTime|timeFormat}}</span> -->
										<span v-if=" item.uid === userId">删除</span>
									</div>
									<div class="button_right">
										<!-- <svg class="button_svg" @click="showDiscuss(item)">
											<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#comment">
											</use>
										</svg> -->
										<svg class="icon button_svg" @click="showDiscuss(item)" aria-hidden="true">
												<use xlink:href="#icon-xinxi"></use>
										</svg>
										<div class="discuss" v-if="item.criticism" :class="{discusshow : item.reviewshow, discusshide : item.reviewhide}">
											<div @click="supportThing(item)" >
												<!-- <svg fill="#fff" :class="{surportdiv : likediv}">
													<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#like">
													</use>
												</svg> -->
												<svg class="icon" :class="{surportdiv : likediv}" aria-hidden="true">
														<use xlink:href="#icon-xihuan"></use>
												</svg>

												<span ref="suporttext">{{item.suporthtml}}</span>
											</div>

											<div @click="criticismThing(item)">
												<!-- <svg fill="#fff">
													<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#discuss"></use>
												</svg> -->
												<svg class="icon" :class="{surportdiv : likediv}" aria-hidden="true">
													<use xlink:href="#icon-comment"></use>
												</svg>

												<span>评论</span>

											</div>
										</div>
									</div>

								</div>
								
								<div class="retext" v-show = "item.likes.length >0 || item.comment.length > 0">
									<svg class="retext_trigon" fill="#efefef">
										<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#trigon"></use>
									</svg>
									<div class="retext_like clear" :class="{likeborder : item.comment.length >0 }" v-show="item.likes.length > 0">
										<svg class="icon retext_like_svg" aria-hidden="true">
												<use xlink:href="#icon-xihuan1"></use>
										</svg>

										<span v-for="(value,index) in item.likes" :key="index">{{value}}<i>,</i></span>
									</div>
									<div class="retext_revert" v-show="item.comment.length > 0">
										<ul>
											<li v-for="(value,index) in item.comment" :key="index">
												<span>{{value.commentName}}</span>：{{value.commentText}}
											</li>
										</ul>
									</div>
								</div>
							</div>
							
						</li>
					</ul>
				</div>

				<!-- 评论 -->
				<section class="criticism" v-if="criticismstate">
					<div class="criticism_con">
						<textarea name="" id="" cols="30" rows="10" ref="textinput" v-model="textareaValue" @input="inputCriticism" @keyup.enter="enterThing"></textarea>
						<span :class="{notempty:changeinput}" @click="commentSend">发送</span>
					</div>
				</section>
        
			</section>
		</section>
	</section>	
</template>

<script>
	import headTop from '@/components/header/head'
	import uploadPreview from '@/config/uploadPreview.js' 
	import {animate} from '@/config/mUtils' 
	import {imgurl} from '@/config/env';
	// import {circle} from '@/service/getData.js' 
	import {mapState, mapActions, mapMutations} from 'vuex'
	import getCookie from '@/common/js/getCookie.js'
	import { Toast } from 'mint-ui'

	export default{
		name:'person',
		data(){
			return{
				filevalue:'',
				imageSrc:false,			//显示的是图片还是文字
				afterclcik:true,		//点击显示上传图片的input
				releaseimgnum:true,		//上传的图片数是否大于1
				timer:null,				//定时器
				timers:null,			//点赞定时器
				bordercss:true,			//点赞的下边框
				likenum:true,			//点赞的人数
				circleData:[],
				likediv:false,			//点击时svg图放大
				textareaValue:'',		//评论输入的内容
				changeinput:false,		//控制发送按钮状态的改变
				criticismstate:false,	//评论显隐
				itemlist:{},			//点击当前的li
				userInfoData:{},			//用户信息
				userId:0,
				userHeader:'http://ww1.sinaimg.cn/mw690/0071KjPhgy1frt6tdb6qbj30j60aswfs.jpg',			//用户头像
				imagestatus:false,
				newImg:'',
				hostId:0
			}
		},
		beforeDestroy(){
				clearTimeout(this.timer);
				clearTimeout(this.timers); 
		},
		mounted(){
			// 通过路由参数获取用户id
			const userId= this.$route.params.userId;
			// 获取缓存的登录人id
			this.hostId = getCookie('userId');
			this.userId=userId      
			console.log(this.hostId)

			// 获取朋友圈数据
			this.getCircle(userId)

			//上传图片并展示图片（无剪裁功能）
			new uploadPreview({
				UpBtn: "input_file",
				ImgShow: "imgSrc",
				ImgType:["gif", "jpeg", "jpg", "bmp", "png"],
				callback:(res)=>{
					Toast({
						message: '主题更换成功！',
						duration: 2000
					})
					this.afterclcik=true;
					this.newImg=this.$refs.imgSrc.src
					this.SAVE_THEMIMG({newImg:this.$refs.imgSrc.src,imagestatus:true})
				}
			})


			// //获取朋友圈数据
			// circle().then((res) => {
			// 	this.circleData = res;
			// })


		},
		components:{
			headTop
		},

		computed:{
			...mapState([
				 "userInfo"
			]),
		},

		methods:{
			...mapMutations([
				"SAVE_THEMIMG", "SAVE_MESSAGE",
			]),
			...mapActions([
				"getUserInfo",
			]),
			
			// 输入内容
			enterThing(){
				this.commentSend()
			},
			exportInput(){
				this.afterclcik=false;
			},
			hideIput(){
				this.afterclcik=true;
				this.SAVE_THEMIMG(this.$refs.imgSrc.src)
			},
			commentShow(item){
				item.criticism=true;
				item.reviewshow=true;
				item.reviewhide=false;
				item.flag=false;
			},
			commentHide(item){
				item.reviewshow=false;
				item.reviewhide=true;
				this.timer=setTimeout(() => {
					clearTimeout(this.timer);
					item.criticism=false;
				},1000)
				item.flag=true;
			},
			showDiscuss(item){ //点击评论按钮点赞与评论出现
				if(item.flag){
					this.commentShow(item)
				}else{
					this.commentHide(item);
				}
			},
			freshPage(){//点击头部页面滚动到顶部
				const getBody = document.getElementsByTagName("body")[0];
				animate(getBody,{scrollTop:0})
			},
			personCircle(){
				return
			},
			supportThing(item){//点赞
				this.likediv=true;
				clearTimeout(this.timers);
				this.timers=setTimeout(()=>{
					this.likediv=false;
				},200);
				this.commentHide(item);		

				if(item.suporthtml == "赞"){
					item.suporthtml="取消";
					// console.log(this.userInfoData.realname)
					item.likes.push(this.userInfoData.realname)

				}else{
					item.suporthtml="赞";
					for(let l=item.likes.length-1;l>=0;l--){
						if(item.likes[l]==this.userInfoData.realname){
							item.likes.splice(l,1)
						}
					}
				}
				// 保存点赞数据到数据库
				this.axios({
					url:'/teamchat.html/friendscircle',
					method:'POST',
					data: {
						op:'postLike',
						postId:item.id,
						likeName:item.realname,
						likes:item.likes,
						suporthtml:item.suporthtml
					}
				}).then(res=>{
					console.log(res)
				})
				
			},
			// 主题图片上传
			themeUp (event) {

				const that = this				
				const file= event.target.files[0]

				const filesData = new FormData();
				if (file) {

					filesData.append("imgsUrl", file) 
					filesData.append("op","changeTheme")
					filesData.append("userId",this.userId)

					// 发送主题图片数据
					this.axios({

						url:'/teamchat.html/friendscircle/post',
						method: 'post',
						data: filesData
						
					}).then(res=>{

						if(res.data.status===1){
							console.log(res)
							Toast({
								message: res.data.result.msg,
								duration: 2000
							})
						}

					})
					
				}else{
					Toast({
						message: '必须选择图片！',
						duration: 2000
					})
				}
        
			},
			getCircle(userId){
				// 获取朋友圈数据
				this.axios
						.get('/teamchat.html/friendscircle',

							{
								params:{
									userId,
									op:'getMyCircle'
								}	
							}

						).then(res=>{

						if(res.data.status===1)

						console.log(res)
						this.userInfoData=res.data.result.userList[0]
						if(this.userInfoData.imageUrl){
							this.newImg='./images/'+this.userInfoData.imageUrl
							this.imagestatus= !this.imagestatus
						}
						this.circleData = res.data.result.circleList 					

				})
			},

			criticismThing(item){//评论

				this.itemlist={};
				this.itemlist=item;
				this.criticismstate=true;
				this.$nextTick(()=>{
					this.$refs.textinput.focus();
				})
				this.commentHide(item);

			},
			inputCriticism(){//文本框是否为空
				this.textareaValue ? this.changeinput=true : this.changeinput=false;
			},
			commentSend(){//评论点击发送
				if(this.changeinput){
					if(this.textareaValue){
						this.itemlist.comment.push({
							// wxid:this.userInfoData.id,
							commentName:this.userInfoData.realname,
							commentText:this.textareaValue
						})

						// 保存评论到数据库
						this.axios({
							url:'/teamchat.html/friendscircle',
							method:'POST',
							data: {
								op:'postComment',
								postId:this.itemlist.id,
								commentId:this.itemlist.uid,
								commentName:this.userInfoData.realname,
								commentText:this.textareaValue
							}

						}).then(res=>{
							console.log(res)
						})

					}
					this.criticismstate=false;
					this.textareaValue='';
					this.changeinput=false;
				}
				
			}
		}
	}
</script>
<style lang="scss" scoped>

	@import '../../common/style/public.scss';

	.child_page{
		position: absolute;
		width:100%;
		height:100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 203;
		background-color: #f8f8f8;
	}
	.refresh{
		position: absolute;
		@include widthHeight(12rem,2rem);
		background:#fff;
		left:2rem;

	}
	.friend_wipe{
		width:100%;
		padding-bottom:1rem;
		background-color: #f8f8f8;
		overflow:scroll;  
		-webkit-overflow-scrolling: touch; 
		.friend{
			padding-top:2.06933rem;
			background-color: #f8f8f8;
			.theme{
				width:100%;
				margin-top:-1px;
				height:11.3706666667rem;
				position:relative;
				.themeinit{
					width:100%;
					height:11.3706666667rem;
					position:absolute;
					top:0;
					left:0;
					background:#000;
					opacity:.6;
				}
				.imgSrc{
					display:block;
					position:absolute;
					top:0;
					z-index:4;
					width:100%;
					height:11.3706666667rem;
				}
				.shoowimg{
					display:none;
				}
				.themetext{
					@include center;
					@include sizeColor(1rem,#000);
					z-index:2;
				}
				.personImg{
					position: absolute;
					right:0.512rem;
					z-index:6;
					bottom:-1.3866666667rem;
					@include justify(flex-end);
					.personame{
						display:block;
						margin-right:0.512rem;
						@include sizeColor(1rem,#fff);
						margin-top:0.96rem;
					}
					.headimg{
						background:#fff;
						border:1px solid #e2e2e2;
						img{
							margin:0.064rem;
							display:block;
							@include widthHeight(3.4133333333rem,3.4133333333rem);
						}
					}
				}
			}
			.coverinput{
				position: absolute;
				z-index:11;
				top:0;
				width:100%;
				height:100%;
				.coverinputbg{
					position: fixed;
					width:100%;
					height:100%;
					top:0;
					background:#000;
					opacity:.3;
				}
				.coverfiletext{
					@include center;
					z-index:5;
					width:11rem;
					height:2.048rem;
					line-height:2.048rem;
					background:#fff;
					border-radius:3px;
					@include sizeColor(0.64rem,#333);	
					.wipeinput{
						position: relative;
						padding-left:1rem;
						.coverfile{
							position: absolute;
							display:block;
							top:0;
							left:0;
							width:11rem;
							height:2.048rem;
							opacity:0;
						}
					}
					
				}
			}
			.shoowinput{
				display:none;
			}
			.condition{
				width:100%;
				padding-top:1.5786666667rem;
				ul{
					width:100%;
					.condition_li{
						padding:0.512rem;
						border-bottom:1px solid #e2e2e2;
						@include justify(flex-start);
						.condition_left{
							width:1.792rem;
							margin-right:0.2986666667rem;
							img{
								display:block;
								@include widthHeight(1.792rem,1.792rem);
							}
						}
						.condition_right{
							h1{
								display:block;
								padding-top:0.1706666667rem;
								@include sizeColor(1rem,#8792b0);
							}
							.publishtext{
								margin-top:0.064rem;
								width:100%;
								@include sizeColor(1rem,#333);
								line-height:0.7466666667rem;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 6;
								-webkit-box-orient: vertical;
								word-break:break-all;
							}
							.publishimg{
								width:100%;
								margin-top:0.3413333333rem;
								img{
									width:40%;
									float:left;
									height:auto;
								}
								.releaseimg{
									width:3.6266666667rem;
									margin-right:0.1066666667rem;
									margin-bottom:0.1066666667rem;
									height:3.6266666667rem;
								}
							}
							.commentbutton{
								@include justify;
								.button_left{
									margin-top:0.576rem;
									span{
										float:left;
										@include sizeColor(1rem,#666);
										margin-right:0.4266666667rem;
									}
									span+span{
										color:#8792b0;
									}
								}
								.button_right{
									margin-top:0.6826666667rem;
									position: relative;
									@include widthHeight(0.9386666667rem,0.64rem);
									.button_svg{
										display:block;
										@include widthHeight(100%,100%);
									}
									.discuss{
										position: absolute;
										@include widthHeight(8.2346666667rem,1.7066666667rem);
										background:#373b3e;
										border-radius:3px;
										right:1.408rem;
										top:-0.5973333333rem;
										box-sizing: border-box;
										@include align;
										div{
											width:50%;
											float:left;
											@include justify(center);

											svg{
												display:block;
												@include widthHeight(0.768rem,0.768rem);
												margin-right:0.2133333333rem;
											}
											span{
												display:block;
												@include sizeColor(0.5546666667rem,#fff);
											}
										}
										div:first-child{
											border-right:2px solid #2f3336;
										}
										.surportdiv{
											animation: pulse 0.5s;
										}
									}
									.discusshow{
										animation: flipInX 1s 1 ease-in-out both;
									}
									.discusshide{
										animation: flipOutX 1s 1 ease-in-out both;
									}
									
								}
							}
							.retext{
								margin-top:0.128rem;
								.retext_trigon{
									display:block;
									@include widthHeight(.8rem,.4rem);
									margin-left:0.4266666667rem;
								}
								.retext_like{
									background:#efefef;
									padding:0.3413333333rem;
									.retext_like_svg{
										float:left;
										@include widthHeight(1rem,1rem);
										margin-right:0.2133333333rem;
										margin-top:0.064rem;
									}
									span{
										float:left;
										margin-right:0.2133333333rem;
										@include sizeColor(1rem,#8792b0);
										i{
											@include sizeColor(1rem,#8792b0);
										}
									}
									span:last-child{
										@include sizeColor(1rem,#8792b0);
										i{
											display:none;
										}
									}
								}
								.likeborder{
									border-bottom:1px solid #e2e2e2;
								}
								.retext_revert{
									background:#efefef;
									ul{
										padding:0.3413333333rem;
										li{
											border:0;
											padding-bottom:0.1rem;
											@include sizeColor(1rem,#333);
											span{
												display:inline-block;
												color:#8792b0;
											}
										}
									}
								}
							}
						}
					}
					.condition_li:last-child{
						border:0;
					}
				}

			}
			.criticism{
				position: fixed;
				left:0;
				z-index:10;
				bottom:0;
				width:100%;
				background:#ebebeb;
				.criticism_con{
					padding:0.4266666667rem 0.64rem;
					@include justify(space-between);
					textarea{
						display:block;
						width:12rem;
						height:1.5rem;
						max-height:3.2rem;
						border:0;
						border-bottom:2px solid #18ae17;
						resize:none;
						flex:1;
						@include sizeColor(0.64rem,#333);
						line-height:0.768rem;
						background:none;
						padding-top:0.32rem;
					}
					span{
						display:block;
						width:1.8rem;
						@include sizeColor(0.5546666667rem,#d2d2d2);
						border:1px solid #d7d7d7;
						text-align:center;
						border-radius:5px;
						line-height:1.3653333333rem;
					}
					.notempty{
						background:#18ae17;
						color:#fff;
						border-color:#3e8d3e;
					}
				}
			}
		}
	}
	
	

	@keyframes flipInX {
	  from {
	    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
	    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
	    -webkit-animation-timing-function: ease-in;
	    animation-timing-function: ease-in;
	    opacity: 0;
	  }

	  40% {
	    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
	    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
	    -webkit-animation-timing-function: ease-in;
	    animation-timing-function: ease-in;
	  }

	  60% {
	    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
	    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
	    opacity: 1;
	  }

	  80% {
	    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
	    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
	  }

	  100% {
	    -webkit-transform: perspective(400px);
	    transform: perspective(400px);
	  }
	}
	@keyframes flipOutX {
	  from {
	    -webkit-transform: perspective(400px);
	    transform: perspective(400px);
	  }

	  30% {
	    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
	    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
	    opacity: 1;
	  }

	  100% {
	    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
	    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
	    opacity: 0;
	  }
	}
	@keyframes pulse {
	  from {
	    -webkit-transform: scale3d(1, 1, 1);
	    transform: scale3d(1, 1, 1);
	  }

	  50% {
	    -webkit-transform: scale3d(1.1, 1.1, 1.1);
	    transform: scale3d(1.1, 1.1, 1.1);
	  }

	  100% {
	    -webkit-transform: scale3d(1, 1, 1);
	    transform: scale3d(1, 1, 1);
	  }
	}
</style>