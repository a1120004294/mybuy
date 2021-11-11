<template>
  <div>
   <el-card shadow="hover" class="box1" >
	   <img src="../assets/ggg.gif" alt="" class="pics">
	   <span></span>
	   <div>
		   <span class="name">{{username}}</span>
		   <span class="roles">{{userrole}}</span>
		   <el-divider></el-divider>
		   <p>登录时间：{{}}</p>
		   <p>登录地点：{{}}</p>
	   </div>
   </el-card>
  </div>
</template>

<script >
  export default {
	name:'welcome',
    data(){
      return{
         username:'',
		 userrole:'超级管理员',
		 imgUrl:'../assets/logo.png',
      }
    },
	components:{
		},
  created() {
  	this.getname();
  },
  methods: {
      getname(){
		this.username = window.sessionStorage.getItem('username');
	  }
      },

    }
</script>

<style scoped>
	.box1{
		width:300px;height: 250px;display: inline-block;
		position: relative;
	}
	.pics{
		border-radius: 50%;
		display: inline-block;
		width: 140px;
		height: 140px;
	}
	.name{
		position: absolute;
		left:185px;
		top: 85px;
	}
	.roles{
		position: absolute;
		left:185px;
		top: 100px;
	}
</style>
