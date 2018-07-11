<template>
    <div>
        <el-table :data="staff_list"
                    stripe
                    style="width: 100%">
            <el-table-column prop="staffid"
                                label="编号"
                                width="120">
            </el-table-column>
            <el-table-column prop="username"
                                label="账号"
                                width="180">
            </el-table-column>
            <el-table-column prop="realname"
                                label="姓名"
                                width="180">
            </el-table-column>
            <el-table-column prop="roles"
                                label="角色列表">
                <template scope="scope">
                    <el-tag v-for="role in scope.row.roles"
                            type="primary"
                            :closable="role.roleid != 1"
                            @close="handleRemoveRole(scope.row,role)">
                        {{role.name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template scope="scope">
                    <el-dropdown @command="handleAddRole(scope.row,$event)"
                                    trigger="click">
                        <el-button type="primary"
                                    plain
                                    size="small">
                            授权
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="role in role_list"
                                                :command="role.roleid"
                                                :disabled="disableOption(role.roleid,scope.row.roles)">
                                {{role.name}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
    </div>
</template>
<script>
    export default {
        data() {
            return {
                staff_list: [],
                total:1,
                pagenum: 1,
                pagesize: 20,
                role_list: [],
            }
        },
        created(){
            this.getStaffList()
            this.getRoleList()
        },
        methods: {
            getStaffList(){
                this.$api.rbac.staff_list(this.pagenum, this.pagesize).then(data => {
                    this.total = data.total
                    this.staff_list = data.data
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            getRoleList(){
                this.$api.rbac.role_list().then(data => {
                    this.role_list = data
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            handleCurrentChange(page){
                this.pagenum = page
                this.getStaffList()
            },
            handleSizeChange(size){
                this.pagesize = size
                this.handleCurrentChange()
            },
            disableOption(roleid,roles){
                let index = roles.findIndex( role => {
                    return role.roleid == roleid
                })
                return index > -1
            },
            handleAddRole(staff,roleid){
                let role = this.role_list.find( role => {
                    return role.roleid === roleid
                })

                this.$confirm(`是否给员工[${staff.realname}]授予[${role.name}]权限?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.staff_role_add({roleid, staffid: staff.staffid}).then( data => {
                        this.$message({
                            type: 'success',
                            message: '授权成功!'
                        });
                        this.getStaffList()
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })

                }).catch(() => {

                });
            },
            handleRemoveRole(staff, role){
                this.$confirm(`是否将角色[${role.name}]从员工[${staff.realname}]中移除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.rbac.staff_role_delete({ staffid: staff.staffid, roleid:role.roleid} ).then( data => {
                        this.$message({
                            type: 'success',
                            message: '移除成功!'
                        });
                        this.getStaffList()
                    }).catch( err => {
                        this.$error(err.errinfo)
                    })
                }).catch(() => {

                });
            }

        }
    }
</script>
<style scope>
    .el-tag{
        margin-right: 5px;
    }
</style>
