<template>
    <div>
        <div style="text-align:right;margin:10px 0">
            <el-button @click="showAddDutyModal()" type="primary">新增职责</el-button>
        </div>

        <el-table
            :data="duty_list"
            @expand="expand"
            style="width: 100%">
            <el-table-column  type="expand">
                <template scope="scope">
                    <el-tag
                        v-for="command in scope.row.command_list"
                        :closable="true"
                        @close="removeCommand(scope.row,command)"
                        type="primary">
                    {{command.name || (command.module + '/' + command.action)}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="职责名称"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template scope="scope">
                    <el-dropdown
                        trigger="click"
                        @command="handleCommand(scope.row,$event)">
                        <el-button type="primary"
                            plain
                            size="small">
                            指派
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="role in role_list" :command="role.roleid">{{role.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="danger"
                        size="small"
                        plain
                        @click="delDuty(scope.row)" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="新增职责" v-model="dialogFormVisible">
            <el-form :model="dutyForm" :rules="rules" ref="dutyForm">
                <el-form-item label="职责名称" prop="name">
                    <el-input v-model="dutyForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddDutyModal()">取 消</el-button>
                <el-button type="primary" @click="addDuty()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                duty_list: [],
                role_list: [],
                dutyForm:{
                    dutyid: '',
                    name: ''
                },
                rules:{
                    name:[
                        {required: true, message: '必须填写职责名称',tigger: 'blur'}
                    ]
                },
                duty_command_list:{},
                dialogFormVisible: false
            }
        },
        created() {
            this.getDutyList()
            this.getRoleList()
        },
        methods:{
            getDutyList(){
                this.$api.rbac.duty_list().then(data => {
                    data.forEach( duty => {
                        duty.command_list = []
                    })
                    this.duty_list = data
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            getRoleList(){
                this.$api.rbac.role_list().then(data => {
                    this.role_list = data
                    this.role_list.forEach( (role) => {
                        role.status = role.status === '1'
                    })
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            delDuty(target){
                this.$confirm(`是否 删除 职责 [ ${target.name} ]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.duty_delete(target.dutyid).then( data => {
                        let index = this.duty_list.findIndex( _duty => {
                            return _duty.name === target.name
                        })
                        this.duty_list.splice(index,1)
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
            showAddDutyModal(){
                this.dialogFormVisible = true
            },
            closeAddDutyModal(){
                this.dialogFormVisible = false
                this.clearForm()
            },
            addDuty(){
                this.$refs['dutyForm'].validate((valid) => {
                    if (valid) {
                        this.$api.rbac.duty_add(this.dutyForm.name).then( data => {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.getDutyList()
                            this.closeAddDutyModal()
                        }).catch( err => {
                            this.$error(err.errinfo)
                        })
                    }else{
                        console.log(valid)
                    }
                })
            },
            clearForm(){
                this.dutyForm = {
                    name: '',
                    module: '',
                    action: ''
                }
            },
            expand(duty, expanded){
                console.log(duty)
                if(expanded){
                    this.$api.rbac.duty_command_list(duty.dutyid).then( data => {
                        duty.command_list = data
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }
            },
            handleCommand(duty, roleid){
                let role = this.role_list.find( role => {
                    return role.roleid === roleid
                })

                this.$confirm(`是否将职责[${duty.name}]指派给角色[${role.name}]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.duty_assign({ dutyid: duty.dutyid, roleid} ).then( data => {
                        this.$message({
                            type: 'success',
                            message: '指派成功!'
                        });
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }).catch(() => {

                });
            },
            removeCommand(duty,command){
                this.$confirm(`是否将指令[${command.name}]从职责[${duty.name}]中移除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.duty_command_delete({ dutyid: duty.dutyid, cmdid:command.cmdid} ).then( data => {
                        this.$message({
                            type: 'success',
                            message: '移除成功!'
                        });
                        this.expand(duty, true)
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
