<template>
    <div>
       <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
       </el-breadcrumb>

       <!-- 卡片视图 -->
       <el-card>
           <!-- 添加角色按钮区域 -->
           <el-row>
               <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
           </el-row>

           <!-- 角色列表区域 -->
           <el-table :data="rolelist" border stripe>
               <!-- 展开列 -->
               <el-table-column type="expand">
                    <template v-slot="scope">
                        <!-- <pre>{{scope.row}}</pre> -->
                        <el-row :class="['bdbottom',index1 == 0 ? 'bdtop' : '','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[index2 != 0 ? 'bdtop' : '','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{ item3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
               <el-table-column :key="1" label="#" type="index"></el-table-column>
               <el-table-column :key="2" label="角色名称" prop="roleName"></el-table-column>
               <el-table-column :key="3" label="角色描述" prop="roleDesc"></el-table-column>
               <el-table-column :key="4" label="操作">
                   <template v-slot="scope">
                       <div class="roleset">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
                            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                       </div>
                   </template>
               </el-table-column>
           </el-table>
       </el-card>

       <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="50%">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色的对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
        width="50%">
        <el-form :model="editForm" ref="editFormRef" label-width="70px">
            <el-form-item label="角色名称">
                <el-input v-model="editForm.roleName" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightdialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <!-- 树形控件 -->
        <el-tree  
            show-checkbox 
            :data="rightsList" 
            :props="treeProps" 
            node-key="id" 
            default-expand-all 
            :default-checked-keys="defKeys"
            ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
     </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //所有角色列表数据
                rolelist: [],
                addDialogVisible: false,
                //添加角色表单数据
                addForm: {
                    roleName: '',
                    roleDesc: ''
                },
                //控制编辑角色对话框的显示与隐藏
                editDialogVisible: false,
                editForm: {},
                //控制显示分配权限对话框的显示与隐藏
                setRightdialogVisible: false,
                rightsList: [],
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                //默认选中节点的id值数组
                defKeys: [],
                roleId: ''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            //获取所有角色列表
            async getRolesList() {
                await this.$http.get('roles').then(res=>{
                    this.rolelist = res.data.data
                    console.log(this.rolelist)
                }).catch(err=>{
                    this.$message.error('获取角色列表失败！')
                })
            },
            //监听添加角色的关闭事件
            addDialogClosed() {
               this.$refs.addFormRef.resetFields()
            },
            //点击按钮，添加新角色
            async addRole() {
                await this.$http.post('roles', this.addForm).then(res=>{
                    this.$message.success('添加角色成功！')
                    this.addDialogVisible = false
                    //重新获取用户列表数据
                    this.getRolesList()
                }).catch(err=>{
                    this.$message.error('添加角色失败！')
                })
            },
            //展示编辑用户的对话框
            async showEditDialog(id) {
                await this.$http.get('roles/'+id).then(res=>{
                    this.editForm = res.data.data
                    // console.log(this.editForm)
                    this.editDialogVisible = true
                }).catch(err=>{
                    this.$message.error('查询角色信息失败')
                })
            },
            //监听编辑角色对话框的关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            //编辑角色信息并提交 
            async editRoleInfo() {
                await this.$http.put('roles/' + this.editForm.id,{ 
                    roleName:this.editForm.roleName,
                    roleDesc:this.editForm.roleDesc
                }).then(res=>{
                    //关闭对话框
                    this.editDialogVisible = false
                    //刷新数据列表
                    this.getRolesList()
                    //提示修改成功
                    this.$message.success('更新角色信息成功！')
                }).catch(err=>{
                    this.$message.error('更新角色信息失败')
                })
            },
            //根据Id删除对应的角色信息
            async removeRoleById(id) {
                await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('roles/' + id)
                    this.getRolesList()
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
            //根据Id删除对应的权限
            async removeRightById(role,rightId) {
                await this.$confirm('此操作将永久删除该权限，是否继续？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res=>{
                    this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(res=>{
                        //会发生页面的完整渲染
                        // this.getRolesList()

                        role.children = res.data.data
                    }).catch(err=>{
                        return this.$message.error('删除权限失败！')
                    })
                }).catch(err=>{
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });  
                    return err
                })
            },
            //展示分配权限的对话框
            async showSetRightDialog(role) {
               this.roleId = role.id
               //获取所有权限的数据
               await this.$http.get('rights/tree').then(res=>{
                   this.rightsList = res.data.data
                   //this.defKeys = []
                   this.getLeafKeys(role,this.defKeys)
                   this.setRightdialogVisible = true
                   //this.$message.success('获取权限数据成功')
               }).catch(err=>{
                   return this.$message.error('获取权限数据失败')
               })
            },
            //通过递归的形式获取角色下所有三级权限的id
            getLeafKeys(node,arr) {
               if(!node.children){
                   return arr.push(node.id)
               }

               node.children.forEach(item => {
                   this.getLeafKeys(item,arr)
               });
            },
            //监听关闭设置权限对话框
            setRightDialogClosed() {
               this.defKeys = []
            },
            //点击为角色分配权限
            async allotRights() {
               const keys = [
                   ...this.$refs.treeRef.getCheckedKeys(),
                   ...this.$refs.treeRef.getHalfCheckedKeys()
               ]

               const idStr = keys.join(',')

               await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res=>{
                   this.$message.success('分配权限成功！')
                   this.getRolesList()
                   this.setRightdialogVisible = false
               }).catch(err=>{
                   this.$message.error('分配权限失败')
               })
            }
        }
    }
</script>

<style lang="scss" scoped>
.roleset {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex: 1;
}
.el-table {
    margin-top: 15px;
}
.el-table::before {
    z-index: inherit;
}
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>