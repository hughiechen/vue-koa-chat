<template>

  <transition name="slide-right">

    <div class="change-team-name">
      <header id="wx-header" >
          <div class="center flex flex-start">

              <div class="iconfont icon-return-arrow" @click="$router.back()">
                  <span>取消</span>
              </div>

              <span class="align-self-center flex-1">发表动态</span>
              <span class="align-self-center " @click="confirmPost">确认</span>
              
          </div>
      </header>
      
      <section>
        <div class="postContainer">
          <textarea name="" v-model.trim="postNews" id="postArea" cols="30" rows="10" resize="none" placeholder="说点什么吧" ></textarea>

          <div class="flex flex-ver  imageContainer" >

              <div v-if="imgsUrl.length>0" v-for="(img,imgIndex) in imgsUrl" :key="imgIndex" class="uploadImgContainer">
                <img :src="img" alt="" class="uploadImg"/>
              </div>
              <svg class="icon icon-jia" aria-hidden="true" @click="addPhoto">
                  <use xlink:href="#icon-jia"></use>
              </svg>

              <input id="inputFile" class="coverfile" name='inputFile' type='file' multiple='mutiple' accept="image/*;capture=camera" style="display: none" @change="fileup">

          </div>
        </div>
      </section>

    </div>

  </transition>

</template>

<script>
import { Toast } from 'mint-ui'
import {mapState, mapActions, mapMutations} from 'vuex'


  export default {
    name:'postNews',
    data(){
      return{
        searchValue:'',
        newTeamName:'',
        postNews:'',
        imgsUrl:[],
        imgForm:null
      }
    },
    computed:{
      ...mapState([
        "teamId","teamName","userId"
      ])
    },
    mounted(){
      this.newTeamName=this.teamName

      console.log(this.userId)
      console.log(this.imgForm)
    },
    methods:{
      ...mapMutations([
          "getTeamName"
      ]),
      // 添加照片
			addPhoto(){
        const file = document.getElementById('inputFile')
        file.click()
      },
      // 图片上传
      fileup(event){
        const that = this
        // const file1 = document.getElementById('inputFile').files[0]
        const files=event.target.files
        // console.log(files)
        const filesData = new FormData();

        // 遍历对象中的每一个文件，并逐一添加到 filesData 实例对象中
        // if(files.length)
        const filesList=Object.values(files)
        if(that.imgsUrl.length>=3){
          Toast({
            message: '图片一次上传不超过3张！',
            duration: 2000
          })
          return;
        }else if(filesList.length>3){
          Toast({
            message: '图片一次上传不超过3张！',
            duration: 2000
          })
          return;
        }

        // 遍历图片信息，保存在filesData里面
        for (let file of filesList) {

          console.log(that.imgsUrl.length)          
          if(that.imgsUrl.length>=2){
            Toast({
              message: '图片一次上传不超过3张！',
              duration: 2000
            })
            return;
          }else if(filesList.length>3){
            Toast({
              message: '图片一次上传不超过3张！',
              duration: 2000
            })
            return;
          }

          if (file) {

            filesData.append("imgsUrl", file) 
            const fr = new window.FileReader()
            fr.onload = function () {
              that.imgsUrl.push(fr.result)
            }
            fr.readAsDataURL(file)
          }else{
            console.log('必须有文件！')
          }     
        }

        this.imgForm=filesData
      },

      // 确认发表动态
      confirmPost(){
        
        if(this.postNews==''){
          Toast({
            message: '说点什么嘛',
            duration: 2000
          });
          return;
        }

        if(this.imgForm){
          this.imgForm.append("op","postnews")
          this.imgForm.append("postNews",this.postNews)
          this.imgForm.append("userId",this.userId)
        }else{
          this.imgForm=new FormData()
          this.imgForm.append("op","postnews")
          this.imgForm.append("postNews",this.postNews)
          this.imgForm.append("userId",this.userId)
        }
        
        
        // 发送图片数据
        this.axios({

          url:'/teamchat.html/friendscircle/post',
          method: 'post',
          data: this.imgForm
          
        }).then(res=>{

          if(res.data.status===1){
            console.log(res)
            Toast({
              message: res.data.result.msg,
              duration: 2000
            });
            setTimeout(() => {
              this.$router.push ({
                path:`/friendsCircle`
              })
            }, 2000)
            
          }

        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    .icon-jia{
      width:3.5em;
      height:3.5em;
      border: 1px solid #e2e2e2;
    }
    #wx-header{
        position: relative;
        padding: 0 15px 0 10px;
        line-height: 2.06933rem;
        opacity: 1;
        width: 100%;
        height: 2.06933rem;
        background: #373b3e;
        z-index: 200;
        color: #fff;
        font-size: 0.704rem;
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
    .postContainer{
      box-sizing: border-box;
      padding:.5rem;
      background: rgb(245, 245, 245);
      #postArea{
        resize: none;
        width:100%;
        display:block;
        padding:.5rem;
        height:8rem;
      }
      .imageContainer{
        background: #fff;
        padding:.5rem;
        .uploadImgContainer{
          height: 3.5em;
          margin-right: .5rem;
          .uploadImg{
            display:block;
            width: 3.5em;
            height: 3.5em;

          }
        }
      }
    }
</style>

