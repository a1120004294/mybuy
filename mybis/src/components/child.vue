<template>
  <div>	  
	  {{msg}}+{{datas}}
  </div>
</template>

<script>
	export default{
		 name: 'childs',
		 props:['datas'],
		data(){
			return{
				msg:'我是子组件一',
			}
		},
	}
</script>

<style>
</style>
