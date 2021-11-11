<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 角色添加按钮 -->
         <el-row>
           <el-col>
             <el-button type="primary">添加角色</el-button>
           </el-col>
         </el-row>
         <!-- 角色列表 -->
         <el-table :data="RolesList" style="width: 100%" border>
           <!-- 展开列 -->
           <el-table-column type="expand">
             <template slot-scope="scope">
               <!-- 循环一级权限列表 -->
                <el-row :class="['bdbttom',i1 == 0 ? 'bdhtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                  <!-- 一级权限 -->
                  <el-col :span="5">
                    <el-tag closable @close="removeClose(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二 三级权限 -->
                  <el-col :span="19">
                    <el-row :class="[i2 == 0 ? '' : 'bdhtop','vcenter']" v-for="(item2,i2) in item1.children" :key='item2.id'>
                      <!-- 二级权限 -->
                      <el-col :span="6">
                        <el-tag type="success" closable @close="removeClose(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 三级权限 -->
                      <el-col el-col :span="18">
                        <el-tag closable @close="removeClose(scope.row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
             </template>
           </el-table-column>
           <!-- 索引列 -->
           <el-table-column type="index" label="#"></el-table-column>
           <el-table-column label="角色名称" prop="roleName"></el-table-column>
           <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
           <el-table-column label="操作">
             <template slot-scope="scope">
                       <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                       <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                       <el-button @click="showSetDialog(scope.row)" type="warning"icon="el-icon-setting" size="mini">分配权限</el-button>
             <el-dialog
               title="权限列表"
               :visible.sync="dialogVisible"
               width="40%"
               @close="RemoveKey"
               >
               <!-- 树形控件 -->
               <el-tree :data="rightsList"
                :props="treeProps"
                 show-checkbox
                 node-key="id"
                 default-expand-all
                 :default-checked-keys="defkeys"
                 ref="treeRef"></el-tree>
               <span slot="footer" class="dialog-footer">
                 <el-button @click="dialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="postRights(scope.row)">确 定</el-button>
               </span>
             </el-dialog>
             </template>
           </el-table-column>
         </el-table>
    </el-card>
  </div>
</template>

<script>
  export default{
    data(){
      return{
            RolesList:[],
            dialogVisible: false,
            rightsList:[],
            //树形控件绑定对象
            treeProps: {
                      children: 'children',
                      label: 'authName'
                    },
             //默认选中的树形选项
            defkeys:[],
            //分配权限的对象id
            showId:"",
      }
    },




    methods:{
           async roleslists(){
             const {data:res} = await this.$http.get('roles');
             if(res.meta.status!==200){
               return this.$message.error('获取角色列表失败');
             };
             this.RolesList=res.data;
           },
           //根据id删除三级权限
          async removeClose(id1,id2){
           const closeResult = await this.$confirm('是否删除', '提示', {
                       confirmButtonText: '确定',
                       cancelButtonText: '取消',
                       type: 'warning',
                     }).catch(err=>err);
                     if(closeResult!=='confirm'){
                       return this.$message.info('你已取消删除');
                     };
                    const {data:res} = await this.$http.delete(`roles/${id1.id}/rights/${id2}`);
                    if(res.meta.status!==200){return this.$message.error('删除权限失败')};
                    //因为传过来的参数是浅拷贝 所以可以直接赋值
                    id1.children = res.data;

           },
           //分配权限
      async showSetDialog(role){
              this.showId = role.id;
              const {data:res} = await this.$http.get('rights/tree');
              if(res.meta.status!==200){
                return this.$message.error('提前权限数据失败')
              }
              this.rightsList=res.data;
              this.dialogVisible = true;
              this.defkeys=[];
              this.getleafkeys(role,this.defkeys);
       },
         //递归函数，获取三级权限id
        getleafkeys(node,arr){
          if(!node.children){
            return arr.push(node.id)
          }
          node.children.forEach(item=>this.getleafkeys(item,arr))
        },

      //监听对话框关闭事件
      RemoveKey(){

      },
      //对话框确定，提交勾选权限,并且刷新列表
     async postRights(datas){
        const Reflist=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
         const idStr = Reflist.join(',')
         const {data:res} = await this.$http.post(`roles/${this.showId}/rights`,{rids:idStr});
         if(res.meta.status!==200){
           return this.$message.error('添加权限失败');
         };
        this.roleslists();
        this.dialogVisible = false;

      }

    },





   created(){

            this.roleslists();

    },
  }
</script>

<style>
  .el-tag{
    margin: 7px;
  }
  .bdbttom{
    border-bottom: 1px solid #eee;
  }
  .bdhtop{
    border-top: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
