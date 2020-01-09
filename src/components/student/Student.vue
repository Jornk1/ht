<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>学生列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <div>
          <!--搜索与添加区域-->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getstudentList">
                <el-button slot="append" icon="el-icon-search" @click="getstudentList"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="dialogVisible=true">添加学生</el-button>
            </el-col>
          </el-row>
          <!--          用户列表区域-->
          <el-table :data="studentlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="学号" prop="stuCode"></el-table-column>
            <el-table-column label="姓名" prop="stuName"></el-table-column>
            <el-table-column label="班级" prop="className"></el-table-column>
            <el-table-column label="性别" prop="stuSex"></el-table-column>
            <el-table-column label="出生日期" prop="stuBirth"></el-table-column>
            <el-table-column label="家庭地址" prop="stuAddress"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editinfo(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removestudent(scope.row.id)"></el-button>
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
      <!--添加学生-->
      <el-dialog
        title="添加学生"
        :visible.sync="dialogVisible"
        width="50%" @close="dialogClosed">
        <!--内容主题区域-->
        <el-form  label-width="80px"
                  :model="addForm"
                  ref="addFormRef"
        >
          <el-form-item label="学号" prop="stuCode">
            <el-input v-model="addForm.stuCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="stuName">
            <el-input v-model="addForm.stuName"></el-input>
          </el-form-item>
          <el-form-item label="班级" prop="className">
            <el-input v-model="addForm.className"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="stuSex">
            <el-input v-model="addForm.stuSex"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="stuBirth">
            <el-input v-model="addForm.stuBirth"></el-input>
          </el-form-item>
          <el-form-item label="家庭地址" prop="stuAddress">
            <el-input v-model="addForm.stuAddress"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域-->
        <span slot="footer" class="dialog-footer">
         <el-button @click="dialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addStudent">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改信息-->
      <el-dialog
        title="修改学生信息"
        :visible.sync="editstu"
        width="50%" @close="editstuClosed">
        <el-form  label-width="80px"
                  :model="editForm"
                  ref="editFormRef"
        >
          <el-form-item label="学号" prop="stuCode">
            <el-input v-model="editForm.stuCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="stuName">
            <el-input v-model="editForm.stuName"></el-input>
          </el-form-item>
          <el-form-item label="班级" prop="className">
            <el-input v-model="editForm.className"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="stuSex">
            <el-input v-model="editForm.stuSex"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="stuBirth">
            <el-input v-model="editForm.stuBirth"></el-input>
          </el-form-item>
          <el-form-item label="家庭地址" prop="stuAddress">
            <el-input v-model="editForm.stuAddress"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editstu = false">取 消</el-button>
          <el-button type="primary" @click="editstudent" >确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取学生传的页面参数
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 7
      },
      // 添加学生的数据
      addForm: {
        stuCode: '',
        stuName: '',
        password: '123456',
        className: '',
        stuSex: 0,
        stuBirth: '',
        stuAddress: ''
      },
      studentlist: [],
      // 用户数量
      total: 0,
      // 添加用户时显示与隐藏
      dialogVisible: false,
      // 修改用户时显示与隐藏
      editstu: false,
      // 读取信息存储
      editForm: {
        id: 0,
        stuCode: '',
        stuName: '',
        className: '',
        stuSex: 0,
        stuBirth: '',
        stuAddress: '',
        stuCard: ''
      }
    }
  },
  created () {
    this.getstudentList()
  },
  methods: {
    // 获取学生数据
    async getstudentList () {
      const { data: res } = await this.$http.get('student/list', { params: this.queryInfo })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.studentlist = res.data.pageData
      this.total = res.data.total
    },
    // 分页获取用户信息
    handleSizeChange (newsize) {
      console.log(newsize)
      this.queryInfo.pageSize = newsize
      this.getstudentList()
    },
    // 页码值监听
    handleCurrentChange (newpage) {
      console.log(newpage)
      this.queryInfo.pageNum = newpage
      this.getstudentList()
    },
    // 关闭添加页面
    dialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭修改页面
    editstuClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加学生数据
    addStudent () {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) return
        // 发起网络请求
        const { data: res } = await this.$http.post('student/save', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.dialogVisible = false
        this.getstudentList()
      })
    },
    // 删除学生信息
    async removestudent (id) {
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
      const { data: res } = await this.$http.post('student/delete' + '?id=' + id)
      if (res.code !== 200) {
        this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getstudentList()
    },
    // 修改学生信息前获取学生信息，放入修改学生的对象中
    editinfo (stu) {
      this.editstu = true
      this.editForm.id = stu.id
      this.editForm.stuCode = stu.stuCode
      this.editForm.stuName = stu.stuName
      this.editForm.className = stu.className
      this.editForm.stuSex = stu.stuSex
      this.editForm.stuAddress = stu.stuAddress
      this.editForm.stuBirth = stu.stuBirth
    },
    // 修改学生数据
    editstudent () {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.post('student/update', this.editForm)
        if (res.code !== 200) {
          this.$message.error('修改失败！')
        }
        this.$message.success('修改成功！')
        this.editstu = false
        this.getstudentList()
      })
    }
  }
}
</script>

<style scoped>

</style>
