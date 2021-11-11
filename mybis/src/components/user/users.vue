<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索添加 -->
      <el-row :gutter="20">
        <el-col :sapn="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :sapn="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          <!-- 添加用户信息弹出框 -->
          <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
            <el-form ref="addformRef" :model="addform" :rules="addrules" label-width="80px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addform.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addform.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addform.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="addform.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="adduser">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 编辑用户信息弹出框 -->
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible1"
            width="30%"
            @close="edietClosed"
            >
           <el-form ref="bianjidataRef" :model="bianjidata" :rules="addrules" label-width="80px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="bianjidata.username" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="bianjidata.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="bianjidata.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible1 = false">取 消</el-button>
              <el-button type="primary" @click="edietUserinfor">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table border :data="userlist" style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态">
          <el-switch slot-scope="scope" v-model="scope.row.mg_state" @change="userstatus(scope.row)">
          </el-switch>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click='burro(scope.row.id)'></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除" placement="top" >
              <el-button type="success" icon="el-icon-delete" size="mini" @click="clearusers(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button @click="userRights(scope.row)" type="danger" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
            <el-dialog
              title="分配角色"
              :visible.sync="dialogUserRights"
              width="40%"
              @close="RemoveClick"
              >
             <div>
               <p>当前用户：{{userInfo.username}}</p>
               <p>当前角色：{{userInfo.role_name}}</p>
               <el-select v-model="userValue" placeholder="请选择角色">
                   <el-option
                     v-for="item in userList"
                     :key="item.id"
                     :value="item.id"
                     :label="item.roleName">
                   </el-option>
                 </el-select>
             </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogUserRights = false">取 消</el-button>
                <el-button type="primary" @click = "getUser">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
      data() {
      //验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        //正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          //合法邮箱
          return cb()
        }
        cb(new Error('请输入合法邮箱'))
      };
      //验证手机的规则
      var checkMobile = (rule, value, cb) => {
        //正则表达式
        const regMobile = /^(0|86|17951)?(1[3-9][0-9|15[0123456789]|17[678|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          //合法手机
          return cb()
        }
        cb(new Error('请输入合法手机号'))
      };
       //
       return {
          //列表对象
          queryInfo: {
            query: "",
            //当前页数
            pagenum: 1,
            //每页显示多少
            pagesize: 10,
          },
          userlist: [],
          total: 0,
          //添加信息弹出
          dialogVisible: false,
          //编辑信息弹出
          dialogVisible1: false,

          //编辑的信息
          bianjidata:{},
          //添加信息
          addform: {
            username: '',
            password: '',
            email: '',
            mobile: '',
          },
          //信息验证
          addrules: {
            username: [{
                required: true,
                message: '请输入用户名',
                trigger: 'blur'
              },
              {
                min: 3,
                max: 10,
                message: '长度在 3 到 10 个字符',
                trigger: 'blur'
              }
            ],
            password: [{
                required: true,
                message: '请输入密码',
                trigger: 'blur'
              },
              {
                min: 6,
                max: 15,
                message: '长度在 6 到 15 个字符',
                trigger: 'blur'
              }
            ],
            email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            }, {validator:checkEmail,trigger: 'blur'}],
            mobile: [{
              required: true,
              message: '请输入手机',
              trigger: 'blur'
            },{validator:checkMobile,trigger: 'blur'} ],
          },
          //添加角色对话框
          dialogUserRights:false,
          //当前分配角色用户信息
          userInfo:{},
          //所有角色数据列表
          userList:[],
          //选中的角色名
          userValue:"",
        };
      },
      //
      created() {
          this.getUserList();
        },
      //
      methods: {
       async getUserList() {
         const {
           data: res
         } = await this.$http.get("users", {
           params: this.queryInfo,
         });

         if (res.meta.status !== 200) {
           return this.$message.error("获取用户列表失败！");
         }
         this.userlist = res.data.users;
         this.total = res.data.total;
       },
       //每页显示条数
       handleSizeChange(val) {
         this.queryInfo.pagesize= val;
         this.getUserList();
       },
       //第几页
       handleCurrentChange(val) {
         this.queryInfo.pagenum = val;
         this.getUserList();
       },
       //更新状态
       async userstatus(userinfo) {
         console.log(userinfo);
         const {
           data: res
         } = await this.$http.put(
           `users/${userinfo.id}/state/${userinfo.mg_state}`
         );
         if (res.meta.status !== 200) {
           userinfo.mg_state = userinfo.mg_state;
           this.$message.error("更新状态失败");
         }
         this.$message.success("更新状态成功");
       },
       //添加对话框
       onSubmit() {
         console.log('submit!');
       },
       //关闭添加信息框关闭事件
       addDialogClosed(){
         this.$refs.addformRef.resetFields();
       },
       //点击确定按钮验证表单
       adduser(){
            this.$refs.addformRef.validate(async valid=>{
              //错误提示
              if(!valid) return this.$message.error('请填写正确信息');
              //正确后发起提交到后台
              const {data:res}=await this.$http.post('users',this.addform);
              if(res.meta.status!==201)return this.$message.error('添加用户失败');
              this.$message.success('添加用户成功');
              //隐藏对话框
              this.dialogVisible = false;
              //重新获取列表
              this.getUserList();
            })
       },
       //id获取用户信息
      async burro(id){
         this.dialogVisible1 = true
         const {data:res} = await this.$http.get('users/'+id);
          if(res.meta.status!==200){
            return this.$message.error('查询信息失败！')
          }
        this.bianjidata=res.data;
        console.log(this.bianjidata)
       },
       //监听编辑表单
       edietClosed(){
         this.$refs.bianjidataRef.resetFields()
       },
       //提交编辑后的表单验证
       edietUserinfor(){
        this.$refs.bianjidataRef.validate(async valid=>{
          console.log(valid)
          if(!valid) return;
          //修改成功提交信息
     const {data:res}=await this.$http.put('users/'+this.bianjidata.id,{email:this.bianjidata.email,mobile:this.bianjidata.mobile});
       if(res.meta.status!==200){
         return this.$message.error('更新用户信息失败')
       };
       console.log(res)
       this.dialogVisible1 = false;
       this.$message.success('更新用户信息成功');
       //重新更新列表
       this.getUserList();
        })
       },
       //删除用户信息
      async clearusers(id) {
        const conformres = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).catch(err=>err )
         //确认删除返回值为字符串 confirm
         //取消删除返回值为字符串 cancel
         if(conformres !=='confirm'){
          return this.$message.info('已经取消删除')
         };
       const {data:res} = await this.$http.delete('users/'+id);
       if(res.meta.status!==200){
         return this.$message.error('删除用户失败')};
        this.$message.success('删除用户成功');
        this.getUserList();
       },

       //打开分配角色对话框
      async userRights(row){
         this.userInfo = row;
         //获取所有角色列表
         const {data:res} = await this.$http.get(`roles`);
         if(res.meta.status!==200){
           return this.$message.error("提取角色列表失败")
         };
         this.userList = res.data;
         this.dialogUserRights = true;
       },
       //选中角色后确定
     async getUser(){
        if(!this.userValue){
         const constshows = await this.$confirm('未选择角色名是否为原角色?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).catch(err=>err);
                if(constshows !=='confirm'){
                 return this.$message.info('已取消')
                };

          const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.userInfo.id});
          if(res.meta.status!==200){
            return this.$message.error("修改角色失败")
          };
          this.$message.success("修改角色成功")
          this.getUserList();
          this.dialogUserRights = false;
        }
        else{
          const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.userValue});
          if(res.meta.status!==200){
            return this.$message.error("修改角色失败")
          };
          this.$message.success("修改角色成功")
          this.getUserList();
          this.dialogUserRights = false;
        };




      },
       //监听分配权限关闭对话框时间
       RemoveClick(){
            this.userInfo={};
            this.userValue='';
       },
      },
      //
    }
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 10px 0;
  }

  .box-card {
    width: auto;
  }

  .el-col-24 {
    width: auto !important;
  }
</style>
