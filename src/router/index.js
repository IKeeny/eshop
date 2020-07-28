import Vue from 'vue'
import VueRouter from 'vue-router'

//解决Element UI导航栏重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
      component:()=>import('@/components/Home'),
      redirect: '/welcome',
      children:[
        {
          path: '/welcome',
          component: ()=>import('@/components/Welcome')
        },{
          path:'/users',
          component: ()=>import('@/components/user/Users')
        },{
          path:'/rights',
          component: ()=>import('@/components/power/Rights')
        },{
          path:'/roles',
          component: ()=>import('@/components/power/Roles')
        },{
          path:'/categories',
          component: ()=>import('@/components/goods/Cate')
        },{
          path:'/params',
          component: ()=>import('@/components/goods/Params')
        }
      ]
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
