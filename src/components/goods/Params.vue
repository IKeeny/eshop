<template>
    <div>
       <!-- 面包屑导航区域 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>参数列表</el-breadcrumb-item>
       </el-breadcrumb>

       <!-- 卡片视图区域 -->
      <el-card>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            :closable="false"
            show-icon>
          </el-alert>

          <!-- 选择商品分类区域 -->
          <el-row class="cat_opt">
              <el-col>
                  <span>选择商品分类：</span>
                  <el-cascader
                    v-model="selectedCateKeys"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange">
                  </el-cascader>
              </el-col>
          </el-row>

          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddParamsDialog">添加参数</el-button>
                <el-table :data="manyTableData" border stripe>
                    <el-table-column type="expand">
                        <template v-slot="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClosed(index,scope.row)">
                                {{item}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="#" type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddParamsDialog">添加属性</el-button>
                <el-table :data="onlyTableData" border stripe>
                    <el-table-column type="expand">
                        <template v-slot="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClosed(index,scope.row)">
                                {{item}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="#" type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
          </el-tabs>
      </el-card>

      <!-- 添加参数的对话框 -->
      <el-dialog
        :title="`添加${titleText}`"
        :visible.sync="addParamsDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      
      <!-- 编辑参数的对话框 -->
      <el-dialog
        :title="`修改${titleText}`"
        :visible.sync="editParamsDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //参数列表
                cateList: [],
                //级联选择框属性配置
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                //级联选择框双向绑定的数组
                selectedCateKeys: [],
                activeName: 'many',
                //动态表格数据
                manyTableData: [],
                //静态表格数据
                onlyTableData: [],
                //控制添加对话框的显示与隐藏
                addParamsDialogVisible: false,
                //添加参数的表单数据对象
                addForm: {
                    attr_name: '',
                },
                //添加表单的验证规则对象
                addFormRules: {
                    attr_name: [
                        {required:true, message:'请输入参数名称', trigger:'blur'}
                    ]
                },
                //控制编辑对话框的显示与隐藏
                editParamsDialogVisible: false,
                //修改参数的表单数据对象
                editForm: {
                    attr_name: '',
                    attr_id: 0
                },
                //添加表单的验证规则对象
                editFormRules: {
                    attr_name: [
                        {required:true, message:'请输入参数名称', trigger:'blur'}
                    ]
                },
                //控制按钮与输入框的切换显示
                inputVisible: false,
                //文本框中输入的内容
                inputValue: ''
            }
        },
        created() {
            this.getCateList()
        },
        computed: {
            //按钮是否需要被禁用
            isBtnDisabled() {
               if(this.selectedCateKeys.length === 3){
                   return false
               }else{
                   return true
               }
            },
            //当前选中的三级分类的id
            cateId() {
                if(this.selectedCateKeys.length === 3){
                    return this.selectedCateKeys[2]
                }else{
                    return null
                }
            },
            //动态计算标题文本
            titleText() {
                if(this.activeName === 'many'){
                    return '动态参数'
                }else{
                    return '静态属性'
                }
            }
        },
        methods: {
            //获取所有商品参数列表
            async getCateList() {
                await this.$http.get(`categories`).then(res=>{
                    this.cateList = res.data.data
                    console.log(this.cateList)
                }).catch(err=>{
                    this.$message.error('获取参数列表失败')
                })
            },
            //级联选择框选中项变化时触发
            handleChange() {
                this.getParamsData()
            },
            //tab页签点击事件的处理函数
            handleTabClick() {
                console.log(this.activeName)
                this.getParamsData()
            },
            //获取参数列表数据
            async getParamsData() {
                if(this.selectedCateKeys.length !== 3){
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return
                }
                console.log(this.selectedCateKeys)
                //根据当前id和所处面板获取对应参数
                await this.$http.get(`categories/${this.cateId}/attributes`,
                    {
                        params: {sel: this.activeName}
                    }
                ).then(res=>{
                    res.data.data.forEach(item=>{
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        //控制文本框的显示与隐藏
                        item.inputVisible = false
                        //文本框中输入的值
                        item.inputValue = ''
                    })
                    console.log(res.data.data)
                    if(this.activeName === 'many'){
                        this.manyTableData = res.data.data
                    }else{
                        this.onlyTableData = res.data.data
                    }
                }).catch(err=>{
                    this.$message.error('获取分类下的参数失败')
                })
            },
            //展示添加参数或属性的对话框
            showAddParamsDialog() {
               this.addParamsDialogVisible = true
            },
            //监听添加对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮，添加参数
            addParams() {
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return
                    await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    }).then(res=>{
                        this.$message.success('添加参数成功')
                        this.addParamsDialogVisible = false
                        this.getParamsData()
                    }).catch(err=>{
                        this.$message.error(err.data.meta.msg)
                    })
                })
            },
            //展示编辑对话框
            async showEditDialog(row) {
                this.editParamsDialogVisible = true
                await this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    params: {
                        attr_sel: this.activeName,
                    }
                }).then(res=>{
                    this.editForm = res.data.data
                }).catch(err=>{
                    this.$message.error(err.data.meta.msg)
                })
            },
            //监听编辑对话框的关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            //点击按钮，修改参数
            editParams() {
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid) return
                    await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName,
                        attr_vals: this.editForm.attr_vals
                    }).then(res=>{
                        this.$message.success('修改参数成功')
                        this.editParamsDialogVisible = false
                        this.getParamsData()
                    }).catch(err=>{
                        this.$message.error(err.data.meta.msg)
                    })
                })
            },
            //根据id删除参数
            removeParamsById(id) {
                this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                    this.getParamsData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            //文本框失去焦点或按下enter键都会触发
            async handleInputConfirm(row) {
                // console.log('OK')
                if(row.inputValue.trim().length === 0){
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false

                this.saveAttrVals(row)
            },
            //将attr_vals的值保存到数据库
            async saveAttrVals(row) {
                await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name: row.attr_name,
                    attr_sel: this.activeName,
                    attr_vals: row.attr_vals.join(' ')
                }).then(res=>{
                    this.$message.success('修改参数项成功')
                }).catch(err=>{
                    this.$message.error(err.data.meta.msg)
                })
            },
            //点击按钮，显示输入框
            showInput(row) {
                row.inputVisible = true
                //让文本框自动获得焦点
                //$nextTick 方法的作用，就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除对应的参数和选项
            handleClosed(index,row) {
                row.attr_vals.splice(index,1)
                this.saveAttrVals(row)
            }
        }
    }
</script>

<style lang="scss" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-table {
    margin-top: 15px;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width:120px;
}
</style>