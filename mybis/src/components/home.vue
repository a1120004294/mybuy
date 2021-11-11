<template>
  <div class="home" style="height: 100%;" >
<el-container>
  <!-- 头部 -->
  <el-header style="text-align: right; font-size: 12px;background-color:#545c64 ;">
    <img src="../assets/pic.png" alt="头像" class="face">
    <span>{{username}}</span>
    <el-button type="danger" class="returned" @click="cleard">退出</el-button>
  </el-header>
  <el-container>
    <!-- 导航栏 -->
    <el-aside :width="iscollapse?'64px':'200px'">
      <div class="toggele-button" >
        <button @click="togglebutton">{{buttons}}</button>
      </div>
      <el-menu
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      :active-text-color="collor"
      unique-opened
      :collapse="iscollapse"
      :collapse-transition="false"
      router
      :default-active="activepath"
      >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title" style="width: 100%;">
          <i :class="iconsobj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key='subitem.id'
        @click=savenav(subitem.path)>
          <template slot="title"><i class="el-icon-location"></i>
          <span>{{subitem.authName}}</span></template>
        </el-menu-item>
      </el-submenu>
  </el-menu></el-aside>
    <!-- 主体部分 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        username: '梁成',
        //导航栏列表
        menulist:[],
        //导航栏图标
        iconlist:{},
        //导航栏点击显示颜色
        collor:'#009AE1',
        //子菜单列表图标
        iconsobj:{
          '125':"iconfont icon-user",
          '103':"iconfont icon-quanxian",
          '101':"iconfont icon-shangpin",
          '102':"iconfont icon-dingdan",
          '145':"iconfont icon-shujuxuanzhong",
        },
        buttons:'折叠',
        //是否折叠
        iscollapse:false,
        //激活链接列表地址
        activepath:'',
      };

    },
    created(){
      this.getmenulist();
      this.activepath = window.sessionStorage.getItem("activepath");
    },
    methods: {
      //退出按钮
      cleard() {
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      //获取菜单栏
     async getmenulist(){
        const {data:res} = await this.$http.get('menus');
        if(res.meta.status!=200)return this.$message.error(res.meta.msg);
        this.menulist = res.data;
      },
      //点击按钮折叠展开
      togglebutton(){
              this.iscollapse=!this.iscollapse
      },
      //保存链接状态
      savenav(activepath){
        this.activepath='/'+activepath;
        console.log(this.activepath);
        window.sessionStorage.setItem("activepath",'/'+activepath);
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;

  }

  .returned {
    border-radius: 5%;
    font-size: 6px;
    padding: 0.3125rem;
  }

  .face {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggele-button{
    background-color: #708090;
    text-align: center;

  }
  .toggele-button button{
    cursor: pointer;
  }
</style>
