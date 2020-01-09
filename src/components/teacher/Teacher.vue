<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>教师信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>教师信息</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <div>
          <!--搜索与添加区域-->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getTeachlist">
                <el-button slot="append" icon="el-icon-search" @click="getTeachlist"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="dialogVisible=true">添加学生</el-button>
            </el-col>
          </el-row>
          <!--          用户列表区域-->
          <el-table :data="teacherlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="教职工号" prop="teaCode"></el-table-column>
            <el-table-column label="姓名" prop="teaName"></el-table-column>
            <el-table-column label="性别" prop="teaSex"></el-table-column>
            <el-table-column label="出生日期" prop="teaBirth"></el-table-column>
            <el-table-column label="家庭地址" prop="teaAddress"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editinfo(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeteach(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页区域-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1,2,3, 4,5, 6, 7,8, 9, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <!--添加教工信息-->
      <el-dialog
        title="添加教职工信息"
        :visible.sync="dialogVisible"
        width="50%" @close="dialogClosed">
        <!--内容主题区域-->
        <el-form  label-width="80px"
                  :model="addForm"
                  ref="addFormRef"
        >
          <el-form-item label="教职工号" prop="teaCode">
            <el-input v-model="addForm.teaCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="teaName">
            <el-input v-model="addForm.teaName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="teaSex">
            <el-input v-model="addForm.teaSex"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="teaBirth">
            <el-input v-model="addForm.teaBirth"></el-input>
          </el-form-item>
          <el-form-item label="家庭地址" prop="teaAddress">
            <el-input v-model="addForm.teaAddress"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域-->
        <span slot="footer" class="dialog-footer">
         <el-button @click="dialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addTea">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改信息-->
      <el-dialog
        title="修改教工信息"
        :visible.sync="editteacher"
        width="50%" @close="editstuClosed">
        <el-form  label-width="80px"
                  :model="editForm"
                  ref="editFormRef"
        >
          <el-form-item label="教工号" prop="teaCode">
            <el-input v-model="editForm.teaCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="teaName">
            <el-input v-model="editForm.teaName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="teaSex">
            <el-input v-model="editForm.teaSex"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="teaBirth">
            <el-input v-model="editForm.teastuBirth"></el-input>
          </el-form-item>
          <el-form-item label="家庭地址" prop="teaAddress">
            <el-input v-model="editForm.teaAddress"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editteacher = false">取 消</el-button>
          <el-button type="primary" @click="editTea" >确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        // 搜索内容
        query: '',
        pageNum: 1,
        pageSize: 7
      },
      teacherlist: [],
      // 总人数
      total: 0,
      // 添加用户时显示与隐藏
      dialogVisible: false,
      // 添加学生的数据
      addForm: {
        teaCode: '',
        teaName: '',
        password: '123456',
        teaSex: 0,
        teaBirth: '',
        teaAddress: '',
        teaCard: ''
      },
      editteacher: false,
      editForm: {
        id: 0,
        teaCode: '',
        teaName: '',
        teaSex: 0,
        teaBirth: '',
        teaAddress: '',
        teaCard: ''
      }
    }
  },
  created () {
    this.getTeachlist()
  },
  methods: {
    async getTeachlist () {
      const { data: res } = await this.$http.get('teacher/list', { params: this.queryInfo })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.teacherlist = res.data.pageData
      this.total = res.data.total
    },
    // 分页获取用户信息
    handleSizeChange (newsize) {
      console.log(newsize)
      this.queryInfo.pageSize = newsize
      this.getTeachlist()
    },
    // 页码值监听
    handleCurrentChange (newpage) {
      console.log(newpage)
      this.queryInfo.pageNum = newpage
      this.getTeachlist()
    },
    // 关闭添加页面
    dialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭修改页面
    editstuClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除教职工信息
    async removeteach (id) {
      console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除了，那么返回值为字符串confirm
      // 如果用户取消删除，那么返回值为字符串cancle
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('你取消了删除')
      }
      const { data: res } = await this.$http.post('teacher/delete' + '?id=' + id)
      if (res.code !== 200) {
        this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getTeachlist()
    },
    // 添加教职工信息
    addTea () {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) return
        // 发起网络请求
        const { data: res } = await this.$http.post('teacher/save', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.dialogVisible = false
        this.getTeachlist()
      })
    },
    editTea () {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.post('teacher/update', this.editForm)
        if (res.code !== 200) {
          this.$message.error('修改失败！')
        }
        this.$message.success('修改成功！')
        this.editteacher = false
        this.getTeachlist()
      })
    },
    editinfo (tea) {
      this.editteacher = true
      this.editForm.id = tea.id
      this.editForm.teaCode = tea.teaCode
      this.editForm.teaName = tea.teaName
      this.editForm.teaSex = tea.teaSex
      this.editForm.teaBirth = tea.teaBirth
      this.editForm.teaAddress = tea.teaAddress
      this.editForm.teaCard = tea.teaCard
    }
  }
}
</script>

<style scoped>

</style>
