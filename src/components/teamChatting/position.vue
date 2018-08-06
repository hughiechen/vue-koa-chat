<template>
    <div class="amap-page-container">
        <!-- 位置头部 -->
        <div class="top-banner flex flex-between">
            <a href="javascript:;" class="back" @click="$router.push('/')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
                <span>我的位置</span>
            </a>
            <a href="javascript:;" class="back" >请选择位置</a>
            <a href="javascript:;" class="back" @click="setPosition">确定</a>
        </div>

        <!-- 地图 -->
        <!-- 搜索栏 -->
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <!-- 地图展示 -->
        <el-amap vid="amap" :zoom="12" :plugin="plugin" class="amapShow" :events="events" :center="mapCenter">
            <el-amap-marker v-for="(marker, mIndex) in markers" :key="mIndex" :position="marker" ></el-amap-marker>
        </el-amap>

        <div class="toolbar">
            <span v-if="loaded">
                地址: {{address}}
            </span>
            <span v-else>正在定位</span>
        </div>
    </div>

  </template>
  <script>
    export default {
        name:"position",
        data() {
            let self = this;
            return {
                markers: [],
                searchOption: {
                    city: '',
                    citylimit: true
                },
                mapCenter: [121.59996, 31.197646],
                lng: 0,
                lat: 0,
                loaded: false,
                address:'',
                events:{
                    'click': (e) => {
                        console.log(e.lnglat)
                        let { lng, lat } = e.lnglat;
                        self.lng = lng;
                        self.lat = lat;

                        // 这里通过高德 SDK 完成。
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });        
                        geocoder.getAddress([lng ,lat], function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                if (result && result.regeocode) {
                                    self.address = result.regeocode.formattedAddress;
                                    self.$nextTick();
                                }
                            }
                        })
                    }
                },
                plugin: [
                    {
                        pName: 'Geolocation',
                        events: {
                            init(o) {
                                // o 是高德地图定位插件实例
                                o.getCurrentPosition((status, result) => {
                                    if (result && result.position) {
                                        self.lng = result.position.lng;
                                        self.lat = result.position.lat;
                                        console.log(result)
                                        self.searchOption.city=result.addressComponent.city
                                        self.address=result.formattedAddress
                                        self.mapCenter = [self.lng, self.lat]
                                        self.loaded = true;
                                        self.$nextTick();
                                    }
                                });
                            }
                            
                        }
                    }
                ]
            }
        },
        methods : {

            // 地图搜索框
            onSearchResult(pois) {
                
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    pois.forEach(poi => {
                        let {lng, lat} = poi;
                        lngSum += lng;
                        latSum += lat;
                    });
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.mapCenter = [center.lng, center.lat];
                    this.markers.push([center.lng, center.lat]);
                    
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });        
                    geocoder.getAddress(this.mapCenter, (status, result)=> {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                this.address = result.regeocode.formattedAddress;
                                this.$nextTick();
                            }
                        }
                    })
                }
            },

            // 确定地址
            setPosition(){
                localStorage.addr=this.address
                this.$router.push({
                    path:`/Group`
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.amap-page-container{
    height: 100%;
    position: relative;
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
    .search-box {
      position: absolute;
      top: 3rem;
      left:0;
      width:100%;
    }
}
.amapShow {
    height: 80%;
}
</style>