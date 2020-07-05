import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:()=>import('@/components/Login')
    },{
      path:'/home',
      component:()=>import('@/components/Home')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
   //to将要访问的路径
   //from代表从哪个路径来
   //next 是一个函数，表示放行

   if(to.path == '/login') return next();
   //获取token
   const tokenStr = window.sessionStorage.getItem('token');
   if(!tokenStr) return next('/login');
   next();
})

export default router
