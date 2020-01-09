<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <div>
          <!--搜索与添加区域-->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
            </el-col>
          </el-row>
<!--          用户列表区域-->
          <el-table :data="userlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="用户级别" prop="nickName"></el-table-column>
            <el-table-column label="注册时间" prop="createTime"></el-table-column>
            <el-table-column label="状态">
              <template>
                <el-switch active-color="#13ce66"
                           inactive-color="#ff4949"
                           v-model="status">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editshowdialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页区域-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1,2,3, 4,5, 6, 7,8]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <!--添加用户的对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%" @close="dialogClosed">
        <!--内容主题区域-->
        <el-form  label-width="80px"
                  :model="addForm"
                  :rules="addFormRules"
                  ref="addFormRef"
        >
          <el-form-item label="用户级别" prop="nickName">
            <el-input v-model="addForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
        </el-form>
       <!-- 底部区域-->
        <span slot="footer" class="dialog-footer">
         <el-button @click="dialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改用户资料的对话框-->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editdialogVisible"
        width="50%" @close="editdialogClosed">
        <el-form  label-width="80px"
                  :model="editForm"
                  :rules="addFormRules"
                  ref="editFormRef"
        >
          <el-form-item label="用户级别" prop="nickName">
            <el-input v-model="editForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 7
      },
      userlist: [],
      // 用户数量
      total: 0,
      // 控制添加对话框的显示与隐藏
      dialogVisible: false,
      // 添加用户数据
      addForm: {
        username: '',
        nickName: '',
        password: '',
        email: ''
      },
      // 添加保单验证规则的对象
      addFormRules: {
        username: [ { required: true, message: '请输入姓名名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [ { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [ { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        nickName: [ { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editdialogVisible: false,
      // 修改用户数据
      editForm: {
        id: 0,
        username: '',
        nickName: '',
        email: '',
        status: 1,
        icon: ''
      },
      status: true
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户信息
    async getUserList () {
      const { data: res } = await this.$http.get('admin/list', { params: this.queryInfo })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.pageData
      if (res.data.pageData.status !== 1) {
        this.status = false
      }
      this.status = true
      this.total = res.data.total
    },
    // 分页获取用户信息
    handleSizeChange (newsize) {
      console.log(newsize)
      this.queryInfo.pageSize = newsize
      this.getUserList()
    },
    // 页码值监听
    handleCurrentChange (newpage) {
      console.log(newpage)
      this.queryInfo.pageNum = newpage
      this.getUserList()
    },
    // 监听对话框的重置事件
    dialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editdialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async vali => {
        if (!vali) return
        // 发起网络请求
        const { data: res } = await this.$http.post('admin/register', this.addForm)
        if (res.code !== 200) {
          this.$message.error('注册用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 点击确定按钮进行用户信息修改，数据交互
    editUser () {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.post('admin/update', this.editForm)
        if (res.code !== 200) {
          this.$message.error('修改失败！')
        }
        this.$message.success('修改成功！')
        this.editdialogVisible = false
        this.getUserList()
      })
    },
    // 修改用户数据，先获取原先的数据
    editshowdialog (user) {
      this.editdialogVisible = true
      this.editForm.id = user.id
      this.editForm.email = user.email
      this.editForm.username = user.username
      this.editForm.nickName = user.nickName
    },
    // 删除用户
    async removeUserById (id) {
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
      const { data: res } = await this.$http.post('admin/delete' + '?id=' + id)
      if (res.code !== 200) {
        this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
