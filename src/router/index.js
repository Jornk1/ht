import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Student from '../components/student/Student'
import Teacher from '../components/teacher/Teacher'
import Department from '../components/department/Department'
import Specialty from '../components/specialty/Specialty'
import StudentResult from '../components/student/StudentResult'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/student', component: Student },
      { path: '/studentResult', component: StudentResult },
      { path: '/teacher', component: Teacher },
      { path: '/department', component: Department },
      { path: '/specialty', component: Specialty }
    ]
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂在路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
