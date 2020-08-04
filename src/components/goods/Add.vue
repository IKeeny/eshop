<template>
    <div>
       <!-- 面包屑导航区域 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
       </el-breadcrumb>

       <!-- 卡片视图区域 -->
       <el-card>
           <el-alert
                title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon>
           </el-alert>
           <!-- 步骤条区域 -->
           <el-steps :space="200" align-center :active="activeIndex - 0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
           </el-steps>
           <!-- tab栏区域 -->
           <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="addForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input type="number" v-model="addForm.goods_price"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input type="number" v-model="addForm.goods_weight"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input type="number" v-model="addForm.goods_number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" prop="goods_cat">
                                <el-cascader
                                    v-model="addForm.goods_cat"
                                    :options="cateList"
                                    :props="cateProps"
                                    @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品参数" name="1">
                            <!-- 渲染表单的item项 -->
                            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                                <el-checkbox-group v-model="item.attr_vals">
                                    <el-checkbox border :label="item2" v-for="(item2,index) in item.attr_vals" :key="index"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品属性" name="2">
                            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                                <el-input v-model="item.attr_vals"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name="3">
                            <el-upload
                                class="upload-demo"
                                :action="uploadURL"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :headers="headersObj"
                                :on-success="handleSucess"
                                list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-tab-pane>
                        <el-tab-pane label="商品内容" name="4">
                            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                        </el-tab-pane>
                </el-tabs>
           </el-form>
       </el-card>

       <!-- 图片预览 -->
       <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%"
        >
            <img :src="previewPath" alt="图片预览" class="previewImg"></img>
       </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex: '0',
                //添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    //商品所属的分类数组
                    goods_cat: [],
                    //图片的数组
                    pics: [],
                    //商品的详情描述
                    goods_introduce: '',
                    attrs: []
                },
                addFormRules: {
                    goods_name: [
                        {required:true, message:'请输入商品名称', trigger:'blur'}
                    ],
                    goods_price: [
                        {required:true, message:'请输入商品价格', trigger:'blur'}
                    ],
                    goods_weight: [
                        {required:true, message:'请输入商品重量', trigger:'blur'}
                    ],
                    goods_number: [
                        {required:true, message:'请输入商品数量', trigger:'blur'}
                    ],
                    goods_cat: [
                        {required:true, message:'请选择商品分类', trigger:'blur'}
                    ]
                },
                //商品分类列表
                cateList: [],
                cateProps:{
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children' 
                },
                //动态参数列表数据
                manyTableData: [],
                //今天属性列表数据
                onlyTableData: [],
                //上传图片的URL地址
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                //图片上传的请求头对象
                headersObj: {
                    Authorization:window.sessionStorage.getItem('token')
                },
                //预览图片的路径
                previewPath: '',
                //控制图片预览对话框的显示与隐藏
                previewVisible: false
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            //获取所有商品分类数据
            getCateList() {
                this.$http.get('categories').then(res=>{
                    this.cateList = res.data.data
                    console.log(this.cateList)
                }).catch(err=>{
                    this.$message.error(err.data.meta.msg)
                })
            },
            //级联选择器选项发生变化，触发这个函数
            handleChange() {
                console.log(this.addForm.goods_cat)
                if(this.addForm.goods_cat.length !== 3){
                    this.addForm.goods_cat = []
                }
            },
            //点击tab离开之前触发的函数
            beforeTabLeave(activeName,oldActiveName) {
                // console.log(activeName)
                // console.log(oldActiveName)
                // //阻止标签页的切换
                // return false

                if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                    this.$message.error('请先选择商品分类！')
                    return false
                }
            },
            //点击tab时触发的函数
            tabClicked() {
                if(this.activeIndex === '1') {                                                
                    this.$http.get(`categories/${this.cateId}/attributes`,{
                        params: { sel:'many' }
                    }).then(res=>{
                        res.data.data.forEach(item=>{
                            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        })
                        this.manyTableData = res.data.data
                        console.log(this.manyTableData)
                    }).catch(err=>{
                        this.$message.error('获取动态参数失败')
                    })
                }
                if(this.activeIndex === '2') {
                    this.$http.get(`categories/${this.cateId}/attributes`,{
                        params: { sel:'only' }
                    }).then(res=>{
                        res.data.data.forEach(item=>{
                            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        })
                        this.onlyTableData = res.data.data
                        console.log(this.manyTableData)
                    }).catch(err=>{
                        this.$message.error('获取静态属性失败')
                    })
                }
            },
            //处理图片预览效果
            handlePreview(file) {
                // console.log(file)
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            //处理移除图片的操作
            handleRemove(file) {
                // console.log(this.addForm.pics)
                // console.log(file.response.data.tmp_path)
                const filePath = file.response.data.tmp_path
                const i = this.addForm.pics.findIndex(x => {
                    x.pic === filePath
                })
                this.addForm.pics.splice(i,1)
                // console.log(this.addForm.pics)
            },
            //监听图片上传成功时
            handleSucess(response) {
                console.log(response)
                //拼接得到一个图片信息对象
                const picsInfo = { pic: response.data.tmp_path }
                //将图片信息push到pics数组里面
                this.addForm.pics.push(picsInfo)
            },
            //添加商品
            add() {
                this.$refs.addFormRef.validate(valid=> {
                    if(!valid) {
                        return this.$message.error('请填写必要的表单项!')
                    }
                    // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
                    // console.log(this.addForm.goods_cat)
                    //深拷贝 lodash cloneDeep(obj) JSON
                    const form = JSON.parse(JSON.stringify(this.addForm))
                    form.goods_cat = form.goods_cat.join(',')
                    //处理动态参数和静态属性
                    this.manyTableData.forEach(item=>{
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',')}
                        this.addForm.attrs.push(newInfo)
                    })
                    this.onlyTableData.forEach(item=>{
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs = this.addForm.attrs

                    //发起请求，添加商品
                    this.$http.post('goods',form).then(res=>{
                        this.$message.success('添加商品成功')
                        this.$router.push('/goods')
                    }).catch(err=>{
                        this.$message.error('添加商品失败')
                        console.log(err)
                    })
                })
            }
        },
        computed: {
            cateId() {
                if(this.addForm.goods_cat.length === 3){
                    return this.addForm.goods_cat[2]
                }else{
                    return null
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.el-checkbox {
    margin: 0 10px 0 0 !important;
}
.previewImg {
    width: 100%;
}
.btnAdd {
    margin-top: 15px;
}
</style>