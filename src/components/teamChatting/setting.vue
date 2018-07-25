<template>
    <div class="dialogue-info">
        <header id="wx-header" >
            <div class="center flex flex-start">

                <div class="iconfont icon-return-arrow" @click="$router.back()">
                    <span>返回</span>
                </div>

                <span class="align-self-center flex-1">聊天信息</span>
            </div>
        </header>
        <div class="member">
            <ul class="chat-dialogue-entry-collect" >
                <li v-for="( members , memberIndex ) in teamMembers" :key="memberIndex">
                    <div >
                        <img :src="members.avatar" />
                    </div>
                    <p>{{members.realname}}</p>
                </li>
                <li>
                    <div class="flex flex-ver flex-center" @click ="$router.push('/Group/setting/inviteNewFriends')">
                        <svg class="icon icon-jia" aria-hidden="true">
                            <use xlink:href="#icon-jia"></use>
                        </svg>
                    </div>
                </li>
                <li v-if="teamHostId==userId">
                    <div class="flex flex-ver flex-center" @click ="$router.push('/Group/setting/deleteTeamMembers')">
                        <svg class="icon icon-jia" aria-hidden="true">
                            <use xlink:href="#icon-jianshao"></use>
                        </svg>
                    </div>
                </li>
            </ul>
        </div>
        <div class="weui-cells">
            <div class="weui-cell weui-cell_access" @click="$router.push('/Group/setting/changeName')">
                <div class="weui-cell__bd">群聊名称</div>
                <div class="weui-cell__ft">{{teamInfo.teamName}}</div>
            </div>
            <!-- <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd">群二维码</div>
                <div class="weui-cell__ft"><img class="_align-middle" style="height:24px" src="../../common/icons/chat-info-qr.png"></div>
            </div> -->
        </div>
        <div class="weui-cells">
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">消息免打扰</div>
                <div class="weui-cell__ft"><input type="checkbox" class="weui-switch" ></div>
            </div>
            <!-- <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd">我在本群的昵称</div>
                <div class="weui-cell__ft"></div>
            </div>
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">显示成员昵称</div>
                <div class="weui-cell__ft"><input type="checkbox" class="weui-switch" ></div>
            </div> -->
        </div>
        <!-- <div class="weui-cells">
            <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd">聊天文件</div>
                <div class="weui-cell__ft"></div>
            </div>
            <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd">查找聊天内容</div>
                <div class="weui-cell__ft"></div>
            </div>
            <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd">设置当前聊天背景</div>
                <div class="weui-cell__ft"></div>
            </div>
        </div> -->
        <!-- <div class="weui-cells">
            <div class="weui-cell">
                <div class="weui-cell__bd">清空聊天记录</div>
                <div class="weui-cell__ft"></div>
            </div>
        </div> -->
        <span class="weui-btn weui-btn_warn" style="margin-top: 15px;padding: 0 20px; width:90%;">删除并退出</span>

    </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex'

    export default {
        name:'setting', 
        data() {
            return {
                showNickname: true,
                teamInfo:{},
                teamMembers:[],
                options:[],
                chosenFriends:[],
                popupVisible:false
            }
        },
        computed:{
            ...mapState([
                "teamId","teamHostId","userId"
            ])
        },
        mounted() {
            console.log(this.teamId,this.teamHostId,this.userId)
            // this.teamId=this.$route.params.teamId
            this.getMemberInfo(this.teamId)
        },
        methods:{
            getMemberInfo(teamId){
                this.axios
                    .get('/teamchat.html/Group/setting',
                        {
                            params:{
                                teamId
                            }
                        }
                    )
                    .then(res=>{
                        console.log(res)
                        if(res.data.status===1) {

                            this.teamMembers=res.data.result.teamMembers
                            this.teamInfo['teamName']=res.data.result.teamMembers[0].teamName

                        }

                    })
            },
            deleteM(){
                this.popupVisible=!this.popupVisible
            }
        }
    }
</script>
<style <style lang="scss" scoped>

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
</style>