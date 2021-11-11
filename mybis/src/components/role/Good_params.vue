<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
 <el-card>
  <el-alert
     title="注意!只允许为第三级分类设置相关参数"
     type="warning"
     show-icon
     :closable="false">
   </el-alert>
   <el-row>
     <el-col style="margin: 15px 0;"> <span>选择商品分类:</span>
       <el-cascader
           :props="paramProps"
           v-model="paramValue"
           :options="paramList"
           @change="handleChange"
           :clearable="true">
           </el-cascader>
     </el-col>
     <el-col>
        <el-tabs v-model="activeName" @tab-click="handleClick">
           <el-tab-pane label="动态参数" name="many">
             <el-button type="primary" :disabled="isDisabled">添加参数</el-button>
           <el-table :data="manyData" style="width: 100%" border stripe>
             <!-- 展开列 -->
             <el-table-column type="expand" class="expands">
               <template slot-scope="scope">
                 <!-- 展开列 -->
                 <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable

                 >
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">
                  + New Tag
                  </el-button>
               </template>
             </el-table-column>
             <!-- 索引列 -->
             <el-table-column type="index" label="#"></el-table-column>
             <el-table-column label="参数名称" prop="attr_name"></el-table-column>
             <el-table-column label="操作">
               <template slot-scope="scope">
                         <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                         <el-button @click="deletePramas(scope.row.attr_id)"  type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
             </el-table-column>
           </el-table>
           </el-tab-pane>
           <el-tab-pane label="静态属性" name="only">
           <el-button type="primary" :disabled="isDisabled">添加属性</el-button>
           </el-tab-pane>
         </el-tabs>

     </el-col>
   </el-row>
 </el-card>
  </div>
</template>

<script>
  export default{
    data(){
      return{
            //级联选择器数据
           paramList:[],
           //级联选择器属性
           paramProps:{
              label:'cat_name',
              value:'cat_id',
              children:'children',

           },
           //级联选择器选择id
           paramValue:[],
           //标签页
           activeName:'many',
           //标签页数据
           manyData:[],
           onlyData:[],
           //添加标签
           inputValue:'',
           inputVisible:false,
      }
    },
    //
    methods:{
        async handleChange(){
              if(this.paramValue.length!==3){
                  this.$message.error('请选择三级分类');
                  this.paramValue = [];
                  return
              }
              //获取参数或者属性
           const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,
           {params:{sel:this.activeName}})
           if(res.meta.status!==200){
             return this.$message.error('获取参数或者属性列表失败')
           }
           res.data.forEach(item=>{
             item.attr_vals = item.attr_vals?item.attr_vals.split(/ |,/):[];
           })
              if(this.activeName=='many'){
                this.manyData=res.data;
              }else{
                this.onlyData=res.data;
              }
         },
         handleClick(){
                 this.handleChange();
         },
         //获取级联选择器数据
        async getParamList(){
           const {data:res} = await this.$http.get('categories');
           if(res.meta.status!==200){
             return this.$message.error('获取分类列表失败')
           }
           this.paramList= res.data;
         },
         //添加标签
         showInput(){
           this.inputVisible=true;
         },
         showInput() {
                 this.inputVisible = true;
                 this.$nextTick(_ => {
                   this.$refs.saveTagInput.$refs.input.focus();
                 });
          },
          handleInputConfirm() {
                  console.log(this.inputValue)
          },
         async deletePramas(id){
           const resulteDele = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).catch(err=>err);
                  if(resulteDele!=='confirm'){
                     this.$message.info('已经取消删除')
                  }else{
                    const {data:res} =await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                      if(res.meta.status!==200){
                        return this.$message.error('删除失败')
                      }
                      this.handleChange()
                  }
          },
    },
    //
    computed:{
             isDisabled(){
               if(this.paramValue.length!==3){
                   return true
               }
              return false
             },
             cateId(){
               if(this.paramValue.length===3){
                 return this.paramValue[2];
               }
               return null
             },
    },
    //
    created(){
          this.getParamList();
    }
  }
</script>

<style>
  .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .el-table__cell{
      text-align: center !important;
    }
    .el-table__cell span{
      margin: 5px ;
    }
</style>
