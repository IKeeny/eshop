<template>
    <div>
       <!-- 面包屑导航区域 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
       </el-breadcrumb>

       <!-- 卡片视图区域 -->
       <el-card>
           <el-row :gutter="20">
               <el-col :span="8">
                   <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                   </el-input>
               </el-col>
               <el-col :span="4">
                   <el-button type="primary" @click="goAddPage">添加商品</el-button>
               </el-col>
           </el-row>

           <!-- 表格区域 -->
           <el-table :data="goodsList" border stripe>
               <el-table-column type="index" label="#"></el-table-column>
               <el-table-column label="商品名称" prop="goods_name"></el-table-column>
               <el-table-column label="商品价格(元)" width="110px" prop="goods_price"></el-table-column>
               <el-table-column label="商品重量" width="80px" prop="goods_weight"></el-table-column>
               <el-table-column label="创建时间" width="170px" prop="add_time">
                   <template v-slot="scope">
                       {{scope.row.add_time | dateFormat}}
                   </template>
               </el-table-column>
               <el-table-column label="操作" width="130px">
                   <template v-slot="scope">
                       <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                       <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row)"></el-button>
                   </template>
               </el-table-column>
           </el-table>

           <!-- 分页区域 -->
           <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background>
           </el-pagination>
       </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //查询参数对象
                queryInfo:{
                    query: '',
                    pagenum: 1,
                    pagesize: 3
                },
                //商品列表
                goodsList: [],
                //商品总数目
                total: 0,
            }
        },
        created() {
            //获取所有的商品
            this.getGoodsList()
        },
        methods: {
            //根据分页获取对应的商品列表
            getGoodsList() {
                this.$http.get('goods',{
                    params: this.queryInfo
                }).then(res=>{
                    console.log(res.data.data)
                    this.goodsList = res.data.data.goods
                    this.total = res.data.data.total
                }).catch(err=> {
                    this.$message.error(err.data.meta.msg)
                })
            },
            //
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            removeById(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$http.delete(`goods/${row.goods_id}`).then(res=>{
                        this.$message.success('删除成功')
                        this.getGoodsList()
                    }).catch(err=>{
                        this.$message.error(err.data.meta.msg)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            goAddPage() {
                this.$router.push(`/goods/add`)
            }
        }
    }
</script>

<style lang="scss" scoped>
.el-table{
    margin-top: 15px;
}
.el-pagination {
    margin-top: 15px;
}
</style>