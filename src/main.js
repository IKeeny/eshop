import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/CSS/global.css'
import { Form,FormItem,Button, Input,Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false

//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
Vue.prototype.$https = axios

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
