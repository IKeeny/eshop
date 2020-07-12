<template>
    <div class="home_div">
      <el-container class="home_container">
          <!-- 头部 -->
          <el-header>
              <div>
                  <img src="@/assets/heima.png" alt="">
                  <span>电商后台管理系统</span>
              </div>
              <el-button type="info" @click="logout">退出</el-button>
         </el-header>
          <!-- 页面主体 -->
          <el-container>
              <!-- 侧边栏 -->
              <el-aside :width="isCollapse ? '64px' : '200px'">
                  <div class="toggle-button" @click="toggleCollapse">|||</div>
                  <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                    active-text-color="#409eff">
                    <el-submenu :index="index.toString()" v-for="(item,index) in menulist" :key="index">
                        <template slot="title">
                        <i :class="iconsObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="subitem.path" v-for="(subitem,index) in item.children" :key="index" @click="saveNavState('/'+subitem.path)">
                            <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
              </el-aside>
              <!-- 右侧内容主体 -->
              <el-main>
                  <router-view></router-view>
              </el-main>
          </el-container>
      </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //左侧菜单数据
                menulist: [],
                iconsObj: {
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao'
                },
                //是否折叠
                isCollapse: false,
                //被激活的链接地址
                activePath:''
            }
        },
        created(){
            this.getMenuList(),
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods:{
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            //获取所有的菜单
            async getMenuList(){
               const {data:res} = await this.$http.get('menus')
               if(res.meta.status != 200) return this.$message.error(res.meta.msg)
               this.menulist = res.data
               //console.log(res)
            },
            //点击按钮切换菜单的折叠和展开
            toggleCollapse(){
              this.isCollapse = !this.isCollapse
            },
            //保存链接的激活状态
            saveNavState(activePath){
              window.sessionStorage.setItem('activePath',activePath)
              this.activePath = activePath
            }
        }
    }
</script>

<style lang="scss" scoped>
.home_div {
    height: 100%;
}
.home_container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div{
        display:flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}

.iconfont {
    margin-right: 10px;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2rem;
    cursor: pointer;
}
</style>