<template>
    <div>
        <div style="text-align:right;margin:10px 0">
            <el-button @click="reloadMenu()" type="warning">发布菜单</el-button>
        </div>

        <el-tree
            :data="menu"
            :props="defaultProps"
            node-key="menuid"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">
        </el-tree>

        <el-dialog title="新增菜单" v-model="dialogFormVisible">
            <el-form :model="menuForm" ref="menuFrom" :rules="rules" label-width="100px">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="menuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单ID" prop="menuid">
                    <el-input v-model="menuForm.menuid"></el-input>
                </el-form-item>
                <el-form-item label="职责" v-if="menuForm.upmenuid != ''" prop="dutyid">
                    <el-select v-model="menuForm.dutyid" placeholder="请选择职责">
                        <el-option v-for="duty in duty_list" :label="duty.name" :value="duty.dutyid"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddMenu()">取 消</el-button>
                <el-button type="primary" @click="confirmAddMenu()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                menu: [{
                    items: [],
                    name: '菜单',
                    main: true,
                    menuid: ''
                }],
                defaultProps: {
                    children: 'items',
                    label: 'name'
                },
                dialogFormVisible: false,
                menuForm:{
                    menuid: '',
                    name: '',
                    upmenuid: '',
                    dutyid: ''
                },
                rules:{
                    name: [{ required: true, message: '请填写菜单名称' }],
                    menuid: [{ required: true, message: '请填写菜单ID' }],
                    dutyid: [{ required: true, message: '请选择职责' }]
                },
                duty_list: []
            }
        },
        created() {
            this.getMenuList()
            setTimeout(this.getDutyList,50)
        },
        methods: {
            getMenuList(){
                this.$api.rbac.menu_list().then( data => {
                    this.menu[0].items = data
                }).catch( err => {
                    this.$error(err.errinfo)
                })
            },
            getDutyList(){
                this.$api.rbac.duty_list().then( data => {
                    this.duty_list = data
                }).catch( err => {
                    this.$error(err.errinfo)
                })
            },
            renderContent(h, { node, data, store }) {
                if(data.main){
                    return (
                        <span>
                            <span>
                                <span>{node.label}</span>
                            </span>
                            <span style="float: right; margin-right: 52px">
                                <el-button plain size="mini" type="success" on-click={ () => this.append(store, data) }> <i class="el-icon-plus"></i> </el-button>
                            </span>
                        </span>);
                }else if(data.items){
                    return (
                        <span>
                            <span>
                                <span>{node.label}  <span class="gray">- {data.menuid}</span></span>
                            </span>
                            <span style="float: right; margin-right: 20px">
                                <el-button plain size="mini" type="success" on-click={ () => this.append(store, data) }><i class="el-icon-plus"></i> </el-button>
                                <el-button plain size="mini" type="danger" on-click={ () => this.remove(store, data) }><i class="el-icon-delete"></i> </el-button>
                            </span>
                        </span>);
                }else{
                    return (
                        <span>
                            <span>
                                <span>{node.label}  <span class="gray">- {data.menuid}</span>  <span class="gray">- {data.dutyname}</span> </span>
                            </span>
                            <span style="float: right; margin-right: 20px">
                                <el-button plain size="mini" type="danger" on-click={ () => this.remove(store, data) }><i class="el-icon-delete"></i> </el-button>
                            </span>
                        </span>);
                }
                // <el-button-group>
                //     <el-button plain size="mini" on-click={ () => this.moveUp(store, data) }><i class="el-icon-arrow-up"></i> </el-button>
                //     <el-button plain size="mini" on-click={ () => this.moveDown(store, data) }><i class="el-icon-arrow-down"></i> </el-button>
                // </el-button-group>

            },
            append(store, data) {
                //store.append({ id: id++, label: 'testtest', children: [] }, data);
                this.menuForm.upmenuid = data.menuid
                this.dialogFormVisible = true
            },
            remove(store, data) {
                console.log(store, data)
                this.$confirm('此操作将永久删除该菜单及其子菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnPressEscape: false,
                    closeOnClickModal: false
                }).then(() => {
                    this.$api.rbac.menu_delete(data.menuid).then( res => {
                        store.remove(data);
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }).catch(() => {

                });
            },
            confirmAddMenu(){
                this.$refs['menuFrom'].validate( valid => {
                    if(valid){
                        this.$api.rbac.menu_add(this.menuForm).then( data => {
                            this.getMenuList()
                            this.resetForm()
                            this.dialogFormVisible = false
                        }).catch( err => {
                            this.$error(err.errinfo)
                        })
                    }
                })
            },
            cancelAddMenu(){
                this.resetForm()
                this.dialogFormVisible = false
            },
            resetForm(){
                this.menuForm = {
                    menuid: '',
                    name: '',
                    upmenuid: '',
                    dutyid: ''
                }
            },
            reloadMenu(){
                this.$confirm('此操作将更新所有用户的菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnPressEscape: false,
                    closeOnClickModal: false
                }).then(() => {
                    this.$api.rbac.menu_reload().then( data => {
                        this.$store.dispatch('menu')
                        this.$message({
                            message: '重载成功',
                            type: 'success',
                        });
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }).catch(() => {

                });
            }
        },

    }
</script>

<style scope>
    .gray{
        color: #ccc
    }

    .el-button+.el-button-group{
        margin-left: 10px
    }
</style>
