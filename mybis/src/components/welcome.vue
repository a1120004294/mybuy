<template>
  <div id="">

	  <div>{{title}}</div>
	  <child :datas="date"></child>
	  <mychild :datas="date2"></mychild>
	  <p>v-if v-show</p>
	  <div v-if="value===2">大于2</div>
	  <div v-else-if="value === 1">等于2</div>
	  <div v-else>小于2</div>
	  <ul><li v-show="item.num===2" v-for="(item,i) in data" :key="i">{{item.pic}}</li></ul>
   <button type="button" @click="bthMessage"></button>

  </div>
</template>
<script>
  import child from './child';
  export default {
	name:'welcome',
    data(){
      return{
        title:'子组件传给父组件数据和组件内自定义组件',
		date:'传给子组件一的',
		date2:'数字加一',
		value:2,
		data:[{num:0,pic:"第一个"},{num:1,pic:"第二个"},{num:2,pic:"第三个"}],
      }
    },
	components:{child,mychild:{
		template:'<div>{{mydata}}<button @click="clickbth">{{datas}}</button></div>',
		props:['datas'],
		data() {
			return {
			  mydata:0,
			}
		},
	    methods:{
			clickbth(){
				this.mydata++
			}
		}
	}},
  methods: {
      bthMessage(){
          coson.log(1)
      }
      },

    }
</script>

<style>
</style>
