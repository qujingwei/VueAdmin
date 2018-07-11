<template>
    <div>
        <div style="text-align:right;margin:10px 0">
            <el-button @click="showAddCommandModal()" type="primary">新建指令</el-button>
            <el-button @click="reloadCommand()" :loading="reloadIsLoading" type="warning">重载指令</el-button>
        </div>

        <el-table :data="command_list" border  style="width: 100%">
            <el-table-column prop="name" label="指令名称">
                <template scope="scope">
                    <el-button type="text" @click="showCommandNameModal(scope.row)">{{scope.row.name || '点击修改'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="module" label="模块" sortable width="140"></el-table-column>
            <el-table-column prop="action" label="动作"></el-table-column>

            <el-table-column prop="dutyid" label="职责" width="140" align="center" :filters="filter_list" :filter-method="filterTag">
                <template scope="scope">
                    <el-tag v-if="scope.row.dutyname" :type="tagColor[scope.row.dutyid % 5]">
                        {{scope.row.dutyname}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template scope="scope">
                    <el-dropdown
                        trigger="click"
                        @command="handleCommand(scope.row,$event)">
                        <el-button type="primary"
                            plain
                            :disabled="typeof scope.row.dutyname !== 'undefined'"
                            size="small">
                            指派
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="duty in duty_list" :command="duty.dutyid">{{duty.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="danger"
                        plain
                        :disabled="scope.row.deleted == 0"
                        size="small"
                        @click="delCommand(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <el-dialog title="修改指令名称" v-model="dialogNameFormVisible">
            <el-form :model="commandNameForm" ref="commandNameForm" :rules="rules" label-width="100px">
                <el-form-item label="指令">
                    <el-input disabled :value="'/' + commandNameForm.module + '/' + commandNameForm.action"></el-input>
                </el-form-item>
                <el-form-item label="指令名称" prop="name">
                    <el-input v-model="commandNameForm.name" placeholder="例: /staff/disable => 员工管理 - 员工禁用"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideCommandNameModal()">取 消</el-button>
                <el-button type="primary" @click="commandRename()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="新增指令" v-model="dialogFormVisible">
            <el-form :model="commandForm" ref="commandForm" :rules="rules" label-width="100px">
                <el-form-item label="指令">
                    <el-select v-model="selected_command" placeholder="请选择" @change="selectCommand">
                        <el-option
                            v-for="item in command_todo_list"
                            :label="'/ '+item.module+' / '+item.action"
                            :value="item.module+'-'+item.action">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指令名称" prop="name">
                    <el-input v-model="commandForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="canceladdCommand()">取 消</el-button>
                <el-button type="primary" @click="addCommand()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                command_list: [],
                total: 1,
                pagenum: 1,
                pagesize: 20,

                dialogFormVisible: false,
                dialogNameFormVisible: false,
                commandForm: {
                    name: '',
                    module: '',
                    action: ''
                },
                commandNameForm: {
                    name: '',
                    cmdid: ''
                },
                rules :{
                    name: [{ required: true, message: '请填写指令名称' }]
                },
                duty_list: [],
                filter_list:[{text:'未指派',value:0}],
                reloadIsLoading: false,
                tagColor:['primary',  'success', 'warning', 'danger', 'gray'],
                command_todo_list:[],
                selected_command:''
            }
        },
        created() {
            this.getCommandList()

            this.getDutyList()
        },
        methods:{
            reloadCommand(){
                this.$confirm('此操作将更新所有用户的接口访问权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnPressEscape: false,
                    closeOnClickModal: false
                }).then(() => {
                    this.reloadIsLoading = true
                    this.$api.rbac.staff_command_reload().then( data => {
                        this.$message({
                            type: 'success',
                            showClose: true,
                            message: '操作成功',
                        })
                        setTimeout( () => this.reloadIsLoading = false , 500)
                    }).catch(err => {
                        this.$error(err.errinfo)
                        setTimeout( () => this.reloadIsLoading = false , 500)
                    })
                }).catch(() => {

                });
            },
            getCommandList(){
                this.$api.rbac.command_list(this.pagenum, this.pagesize).then(data => {

                    this.total = data.total
                    this.command_list = data.data
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            getCommandTodoList(){
                this.$api.rbac.command_todo_list().then(data => {
                    this.command_todo_list = data
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            getDutyList(){
                this.$api.rbac.duty_list().then(data => {
                    this.duty_list = data
                    this.duty_list.forEach( (duty) => {
                        this.filter_list.push({
                            text: duty.name,
                            value: duty.dutyid
                        })
                    })
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            handleSizeChange(size){
                this.pagesize = size
                this.getCommandList()
            },
            handleCurrentChange(current_page){
                this.pagenum = current_page
                this.getCommandList()
            },
            showAddCommandModal(){
                this.getCommandTodoList()
                this.dialogFormVisible = true
            },
            addCommand(){
                this.$refs['commandForm'].validate( valid => {
                    if(valid){
                        this.$api.rbac.command_add(this.commandForm).then( data =>{
                            this.getCommandList()
                            this.canceladdCommand()
                        }).catch( err => {
                            this.$error(err.errinfo)
                        })
                    }
                })
            },
            delCommand(target){
                this.$confirm(`是否 删除 指令 [ ${target.name} ${target.module}/${target.action} ]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.command_delete(target.cmdid).then( data => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getCommandList()
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })

                }).catch(() => {

                });
            },
            canceladdCommand(){
                this.dialogFormVisible = false
                this.clearForm()
            },
            clearForm(){
                this.commandForm = {
                    name: '',
                    module: '',
                    action: ''
                }
            },
            handleCommand(command, dutyid){
                let duty = this.duty_list.find( duty => {
                    return duty.dutyid === dutyid
                })

                this.$confirm(`是否将指令[${command.name} ${command.module}/${command.action}]指派给[${duty.name}]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.duty_command_add({ cmdid:command.cmdid, dutyid} ).then( data => {
                        this.$message({
                            type: 'success',
                            message: '指派成功!'
                        });
                        this.getCommandList()
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }).catch(() => {

                });
            },
            selectDuty(command, dutyid){
                let duty = this.duty_list.find( duty => {
                    return duty.dutyid === dutyid
                })

                this.$confirm(`是否将指令[${command.name} ${command.module}/${command.action}]指派给[${duty.name}]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.duty_command_add({ cmdid:command.cmdid, dutyid} ).then( data => {
                        command.dutyname = duty.name
                        command.dutyid = duty.dutyid
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
            selectCommand(value){
                let obj = value.split('-')
                this.commandForm.module = obj[0]
                this.commandForm.action = obj[1]
            },
            filterTag(value, row){
                if(value === 0){
                    return typeof row.dutyid === 'undefined'
                }
                return row.dutyid === value
            },
            commandRename(){
                this.$refs['commandNameForm'].validate( valid => {
                    if(valid){
                        this.$api.rbac.command_rename(this.commandNameForm ).then( data => {
                            this.$message({
                                type: 'success',
                                message: '重命名成功!'
                            });
                            this.getCommandList()
                            this.hideCommandNameModal()
                        }).catch( err => {
                            this.$error(err.errinfo)
                        })
                    }
                })
            },
            showCommandNameModal(command){
                this.dialogNameFormVisible = true
                this.commandNameForm = command
                // this.commandNameForm.name = command.name
            },
            hideCommandNameModal(){
                this.dialogNameFormVisible = false
                this.commandNameForm = {
                    cmdid: '',
                    name: '',
                    module: '',
                    action: ''
                }
            }
        }
    }
</script>
<style>
    .el-select{
        width: 100%
    }
</style>
