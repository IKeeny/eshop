<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>订单管理</el-breadcrumb-item>
           <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            
            <!-- 订单列表数据 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send">
                    <template v-slot="scope">
                        {{ scope.row.is_send }}
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template v-slot="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressDialog"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 修改地址的对话框 -->
            <el-dialog
                title="修改地址"
                :visible.sync="addressVisible"
                width="50%"
                @close="addressDialogClosed"
            >
                <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                    <el-form-item label="省市区/县" prop="address1">
                       <el-input v-model="addressForm.address1"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                       <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editOrder">确 定</el-button>
                </span>
            </el-dialog>
            
            <!-- 物流进度的对话框 -->
            <el-dialog
                title="物流进度"
                :visible.sync="progressVisible"
                width="50%"
            >
               <el-timeline>
                    <el-timeline-item
                    v-for="(activity, index) in progressInfo"
                    :key="index"
                    :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                total: 0,
                orderList: [],
                addressVisible: false,
                addressForm: {
                    address1: [],
                    address2: ''
                },
                addressFormRules: {
                    address1:[
                        { required:true, message:'请选择省市区/县',trigger:'blur' }
                    ],
                    address2:[
                        { required:true, message:'请填写详细地址',trigger:'blur' }
                    ]
                },
                progressVisible: false,
                progressInfo: []
            }
        },
        created() {
            this.getOrderList()
        },
        methods: {
            getOrderList() {
                this.$http.get('orders', {params:this.queryInfo}).then(res=>{
                    this.total = res.data.data.total
                    this.orderList = res.data.data.goods
                }).catch(err=>{
                    this.$message.error('获取订单列表失败！')
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            //展示修改地址的对话框
            showEditDialog() {
                this.addressVisible = true
            },
            editOrder() {
                this.addressVisible = false
                this.$refs.addressFormRef.resetFields()
            },
            addressDialogClosed() {
                this.addressVisible = false
            },
            //展示物流进度的对话框
            showProgressDialog() {
                this.$http.get(`/kuaidi/1106975712662`).then(res=>{
                    this.progressInfo = res.data.data
                    console.log(this.progressInfo)
                }).catch(err=>{
                    this.$message.error('获取物流进度失败！')
                })
                this.progressVisible = true
            }
        }
    }
</script>

<style lang="scss" scoped>
.el-table {
    margin-top: 15px;
}
</style>