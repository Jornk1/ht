<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>院系信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>院系信息</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <div>
          <!--搜索与添加区域-->
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary">添加学生</el-button>
            </el-col>
          </el-row>
          <el-table :data="getdepartment" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-button type="primary">查看院系基本信息</el-button>
                <el-button type="primary" @click="getspecialtyList(scope.row.id)">查看院系专业</el-button>
                <el-table :data="getspecialty" border stripe>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="院系开设专业" prop="speName"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="院系信息" prop="depName"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      getdepartment: [],
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 7
      },
      specialtylist: {
        id: 0,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      getspecialty: []
    }
  },
  created () {
    this.getDepartmentList()
  },
  methods: {
    // 获取院系基本信息
    async getDepartmentList () {
      const { data: res } = await this.$http.get('department/list', this.queryInfo)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.getdepartment = res.data.pageData
      this.total = res.data.total
    },
    /* 获取院系专业详情 */
    async getspecialtyList (id) {
      this.specialtylist.id = id
      const { data: res } = await this.$http.get('department/specialty/' +
        this.specialtylist.id +
        '?pageNum=' + this.specialtylist.pageNum + '&pageSize=' + this.specialtylist.pageSize)
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.getspecialty = res.data.pageData
    }
  }
}
</script>

<style lang="less" scoped>

</style>
