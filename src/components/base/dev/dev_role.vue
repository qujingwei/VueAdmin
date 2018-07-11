<template>
    <div>
        <div style="text-align:right;margin:10px 0">
            <el-button @click="showAddRoleModal()" type="primary">新增角色</el-button>
        </div>

        <el-table :data="role_list" @expand="expand" style="width: 100%">
            <el-table-column  type="expand">
                <template scope="scope">
                    <el-tag
                        v-for="duty in scope.row.duty_list"
                        :closable="true"
                        @close="removeDuty(scope.row,duty)"
                        type="primary">
                    {{duty.name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="角色名称"></el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template scope="scope">
                    <el-button type="danger"
                        v-if="scope.row.roleid * 1 > 3"
                        size="small"
                        plain
                        @click="delRole(scope.row)" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="新增角色" v-model="dialogFormVisible">
            <el-form :model="roleForm" :rules="rules" ref="roleForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddRoleModal()">取 消</el-button>
                <el-button type="primary" @click="addRole()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                role_list: [],
                roleForm:{
                    roleid: '',
                    name: ''
                },
                rules:{
                    name:[
                        {required: true, message: '必须填写角色名称',tigger: 'blur'}
                    ]
                },
                role_duty_list: {},
                dialogFormVisible: false
            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
            getRoleList(){
                this.$api.rbac.role_list().then(data => {
                    data.forEach( role => {
                        role.duty_list = []
                    })
                    this.role_list = data
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            delRole(target){
                this.$confirm(`是否 删除 角色 [ ${target.name} ]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.role_delete(target.roleid).then( data => {
                        let index = this.role_list.findIndex( _role => {
                            return _role.name === target.name
                        })
                        this.role_list.splice(index,1)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })

                }).catch(() => {

                });
            },
            showAddRoleModal(){
                this.dialogFormVisible = true
            },
            closeAddRoleModal(){
                this.dialogFormVisible = false
                this.clearForm()
            },
            addRole(){
                this.$refs['roleForm'].validate((valid) => {
                    if (valid) {
                        this.$api.rbac.role_add(this.roleForm.name).then( data => {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.getRoleList()
                            this.closeAddRoleModal()
                        }).catch( err => {
                            this.$error(err.errinfo)
                        })
                    }else{
                        console.log(valid)
                    }
                })
            },
            clearForm(){
                this.roleForm = {
                    name: '',
                    roleid: ''
                }
            },
            expand(role, expanded){
                if(expanded){
                    this.$api.rbac.role_duty_list(role.roleid).then( data => {
                        role.duty_list = data
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }
            },
            removeDuty(role,duty){
                if(
                    this.ROLE_TYPE.superman === role.roleid && (duty.dutyid == 1 || duty.dutyid == 2) // 超级管理员 开发管理 个人中心
                ){
                    this.$message({
                        type: 'warning',
                        message: '基础权限不可删除!'
                    });
                    return false
                }
                if(
                    this.ROLE_TYPE.user === role.roleid && duty.dutyid == 2 // 普通用户 个人中心
                ){
                    this.$message({
                        type: 'warning',
                        message: '基础权限不可删除!'
                    });
                    return false
                }
                this.$confirm(`是否将职责[${duty.name}]从角色[${role.name}]中移除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.role_duty_delete({ dutyid: duty.dutyid, roleid:role.roleid} ).then( data => {
                        this.$message({
                            type: 'success',
                            message: '移除成功!'
                        });
                        this.expand(role, true)
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }).catch(() => {

                });
            }
        }
    }
</script>
<style>
    .el-card{
        box-shadow: none;
        border-radius: 0
    }
    .el-card__header{
        padding: 11px 20px;
    }
    .el-tag{
        margin:5px 5px 5px 0;
    }
</style>
