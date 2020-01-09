<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div><div class="left"><img src="../assets/logo.png" class="img"></div><span>XX学校教务管理系统</span></div>
      <el-button type="info" @click="logout">Logout</el-button></el-header>
    <el-container>
      <!--左边-->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">||||</div>
        <!--侧边栏菜单区-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
         <!-- 一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in yhxx" :key="item.id">
<!--            一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i class="iconfont icon-people"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="item1.path + ''" v-for="item1 in item.children" :key="item1.id" @click="saveNavState">
              <template slot="title">
              <!--图标-->
              <i class="iconfont icon-ren"></i>
              <!--文本-->
              <span>{{item1.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边页面-->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      yhxx: [
        { id: 1, authName: '用户管理', children: [{ id: 11, authName: '用户信息', path: 'users' }] },
        { id: 2, authName: '学生管理', children: [{ id: 12, authName: '学生信息', path: 'student' }, { id: 16, authName: '学生成绩', path: 'studentResult' }] },
        { id: 3, authName: '教师管理', children: [{ id: 13, authName: '教师信息', path: 'teacher' }] },
        { id: 4, authName: '专业管理', children: [{ id: 14, authName: '专业信息', path: 'specialty' }] },
        { id: 5, authName: '院系管理', children: [{ id: 15, authName: '院系信息', path: 'department' }] }
      ],
      isCollapse: false,
      activePath: ''

    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 25px;
  align-items: center;
  color:#fff;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
    span{margin-left: 15px}
  }
  .left{
    width: 50px;
    height: 50px;
    .img{
      width: 100%;
      height: 100%;
    }
  }
}
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: 0;
    }
  }
  .el-main{
    background-color: #ccc;
  }
  .home-container{
    height: 100%;
  }
  .iconfont{
    margin-right: 10px;
  }
.toggle-button{
  background-color: #4a5064;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  }
</style>
