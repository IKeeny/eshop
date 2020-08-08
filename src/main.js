import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/CSS/global.css'
import { Form,FormItem,Button, Input,Message,Container,
  Aside,Main,Header,Menu,Submenu,MenuItem,MenuItemGroup,
  Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,
  Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,
  Tree,Select,Option,Cascader,Alert,Tabs,TabPane,
  Steps,Step,Checkbox,CheckboxGroup,Upload,Timeline,TimelineItem} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '@/assets/fonts/iconfont.css'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
//请求拦截器
axios.interceptors.request.use(config=>{
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup) 
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d}: ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
