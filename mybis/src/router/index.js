import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome.vue'
import users from '@/components/user/users.vue'
import roles from '@/components/role/roles.vue'
import rights from '@/components/role/rights.vue'
import Good_params from '@/components/role/Good_params.vue'



Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      redirect:'/login',
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      //重定向
      redirect:'/welcome',
      component: home,
      children:[
        {path: '/welcome',component: welcome},
        {path: '/users',component: users},
        {path: '/roles',component: roles},
        {path: '/rights',component: rights},
        {path: '/params',component: Good_params},               
        ]
    }
  ]
})
//路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问页面
  //from 从哪个路径跳转而来
  //next 是一个函数 表示可以跳转
  // next() 放行 next('路由地址')强制跳转
  if(to.path ==='/login') return next();
  //获取token
  const tokens = window.sessionStorage.getItem('token');
  if(!tokens) return next('/login');
  //实例化next
  next()
})

export default router
