<template>
    <div>
        <el-table :data="staff_list" border stripe style="width: 100%">
            <el-table-column prop="staffid" label="编号"></el-table-column>
            <el-table-column prop="username" label="账号" width="160"></el-table-column>
            <el-table-column prop="realname" label="姓名"></el-table-column>
            <el-table-column prop="branchid" label="部门"></el-table-column>
            <el-table-column prop="regtime" label="注册时间" width="210"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        on-color="#13ce66"
                        off-color="#ff4949"
                        on-text="启用"
                        off-text="禁用"
                        @change="handleStatusSwitch(scope.row, $event)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template scope="scope">
                    <el-button type="danger"
                        :disabled="scope.row.status != 0"
                        size="small"
                        plain
                        @click="delStaff(scope.row)">删除</el-button>
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
                pagesize: 20
            }
        },
        created() {
            this.getStaffList()
        },
        methods:{
            getStaffList(){
                this.$api.staff.page_list(this.pagenum, this.pagesize).then(data => {
                    this.total = data.total
                    this.staff_list = data.data
                    this.staff_list.forEach( (staff) => {
                        staff.status = staff.status === '1'
                    })
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
                this.getStaffList()
            },
            delStaff(target){
                let staff = target
                this.$confirm(`是否 删除 用户 [ ${target.realname} ]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    this.$api.staff.delete(target.staffid).then( data => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getStaffList()
                    }).catch( err => {

                        this.$error(err.errinfo)
                    })

                }).catch(() => {

                });
            },
            handleStatusSwitch(target, new_state){
                let type = 'warning'
                let action = '停用'
                let staffid = target.staffid

                let isEnable = new_state

                if(isEnable){
                    type = 'success'
                    action = '启用'
                }

                this.$confirm(`是否 ${action} 员工 [ ${target.realname} ]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: type
                }).then(() => {
                    if(isEnable){
                        this.$api.staff.enable(staffid).then( data => {
                            target.status = true
                            this.$message({
                                type: 'success',
                                message: action + '成功!'
                            });
                        }).catch( err => {
                            target.status = false
                            this.$error(err.errinfo)
                        })
                    }else{
                        this.$api.staff.disable(staffid).then( data => {
                            target.status = false
                            this.$message({
                                type: 'success',
                                message: action + '成功!'
                            });
                        }).catch( err => {
                            target.status = true
                            this.$error(err.errinfo)
                        })
                    }
                }).catch(() => {
                    target.status = !isEnable
                });
            }
        }
    }
</script>
