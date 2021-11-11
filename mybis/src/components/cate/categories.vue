<template>
    <div class="main" id="container">
        <iframe id="mapPage" width="100%" height="100%" frameborder=0 
            src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=TN6BZ-LXSLK-GXAJL-A7FDS-6B2P3-PXBI7&referer=myapp">
        </iframe>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    },
    created(){
        this.listen();
      
    },
    computed:{
        // count(){
        //     return this.$store.state.count
        // }
        
    },
    methods:{
        listen() {
            window.addEventListener('message', function(event) {
                // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                var loc = event.data;
                if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                    console.log('location', loc); // 获取的选中的地址数据
                    console.log(loc.poiaddress)
                }
                return false
            }, false);
        },       
    }
}
</script>

<style>
    .main{
        width:100vw;
        height:100vh;
    }
</style>