<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table :data="RightsList" style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
     <!-- 分页器 -->
     <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="rightPagenum" :page-sizes="[10, 20, 30, 40]" :page-size="rightPagesize"
      layout="sizes, prev, pager, next, jumper" >
      </el-pagination> -->
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //权限列表
        RightsList: [],
        //列表显示页
        rightPagenum:1,
        //列表页数
        rightPagesize:12,
      }
    },
    methods: {
      //每页显示条数
      // handleSizeChange(val) {
      //   this.rightPagesize= val;
      //   this.getRightList();
      // },
      //第几页
      // handleCurrentChange(val) {
      //   this.rightPagenum = val;
      //   this.getRightList();
      // },
      //获取权限列表
      async getRightList() {
        const {
          data: res
        } = await this.$http.get('rights/list');
        if (res.meta.status !== 200) {
          return this.$message.error('获取列表失败')
        }
        this.RightsList = res.data
        console.log(this.RightsList);
      },
    },
    created() {
      this.getRightList();
    },
  }
</script>

<style>
</style>
