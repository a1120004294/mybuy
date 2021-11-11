<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../../build/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginformref" :model="loginform" :rules="loginrules" label-width="0" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginform.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password v-model="loginform.password" prefix-icon="el-icon-wallet"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="resetloginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        //登录表单数据
        loginform: {
          username: 'admin',
          password: '123456',
        },
        loginrules: {
          username: [
                      { required: true, message: '请输入用户名', trigger: 'blur' },
                      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
          password: [
                      { required: true, message: '请输入密码', trigger: 'blur' },
                      { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],

        }
      };

    },
    methods: {
         //提交文本框
      submitForm() {
               this.$refs.loginformref.validate(async valid=>{
                 if(!valid);
                const {data:res}=await this.$http.post('login',this.loginform)
                if(res.meta.status !==200)return this.$message.error('账号不存在，请注册');
                 this.$message.success('成功');
                 //保存token到sessionStorage
                 window.sessionStorage.setItem('token',res.data.token);
                 //跳转到home组件
                 this.$router.push('/home');
               })
            },
            //重置文本框
       resetloginform(){
         console.log(1);
         this.$refs.loginformref.resetFields();
       }
    },
  }
</script>

<style scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FFFFFF;
  }

  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }
</style>
