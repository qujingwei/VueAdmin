<template>
    <div>
        <el-table :data="branch_list" border stripe style="width: 100%">
            <el-table-column prop="branchid" label="编号"></el-table-column>
            <el-table-column prop="name" label="部门名称"></el-table-column>
            <el-table-column prop="upbranchid" label="上级部门"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        on-color="#13ce66"
                        off-color="#ff4949"
                        on-text="启用"
                        off-text="停用"
                        :disabled="scope.row.branchid == '1'"
                        @change="handleStatusSwitch(scope.row, $event)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button type="danger"
                        :disabled="scope.row.status != 0 || scope.row.branchid == '1'"
                        size="small"
                        plain
                        @click="delBranch(scope.row)">删除</el-button>
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
    import api from '../../../api'
    import errinfo from '../../../errinfo'

    export default {
        data() {
            return {
                branch_list: [],
                total:1,
                pagenum: 1,
                pagesize: 20
            }
        },
        created() {
            this.getBranchList()
        },
        methods:{
            getBranchList(){
                api.branch.page_list(this.pagenum, this.pagesize).then(data => {
                    this.total = data.total
                    this.branch_list = data.data
                    this.branch_list.forEach( (branch) => {
                        branch.status = branch.status === '1'
                    })
                }).catch(err => {
                    this.$message({
                        showClose: true,
                        message: errinfo[err.errcode],
                        type: 'error'
                    });
                })
            },
            handleSizeChange(size){
                this.pagesize = size
                this.getBranchList()
            },
            handleCurrentChange(current_page){
                this.pagenum = current_page
                this.getBranchList()
            },
            delBranch(target){
                this.$confirm(`是否 删除 部门 [ ${target.name} ]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    api.branch.delete(target.branchid).then( data => {
                        let index = this.branch_list.findIndex( _branch => {
                            return _branch.branchid === target.branchid
                        })
                        this.branch_list.splice(index,1)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch( err => {

                        this.$message({
                            type: 'error',
                            message: '删除失败!' + errinfo[err.errcode]
                        });
                    })

                }).catch(() => {

                });
            },
            handleStatusSwitch(target, new_state){
                let type = 'warning'
                let action = '停用'
                let branchid = target.branchid

                let isEnable = new_state

                if(isEnable){
                    type = 'success'
                    action = '启用'
                }

                this.$confirm(`是否 ${action} 部门 [ ${target.name} ]?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    closeOnPressEscape: false,
                    type: type
                }).then(() => {
                    if(isEnable){
                        api.branch.enable(branchid).then( data => {
                            target.status = true
                            this.$message({
                                type: 'success',
                                message: action + '成功!'
                            });
                        }).catch( err => {
                            target.status = false
                            this.$message({
                                type: 'error',
                                message: action + '失败!' + errinfo[err.errcode]
                            });
                        })
                    }else{
                        api.branch.disable(branchid).then( data => {
                            target.status = false
                            this.$message({
                                type: 'success',
                                message: action + '成功!'
                            });
                        }).catch( err => {
                            target.status = true
                            this.$message({
                                type: 'error',
                                message: action + '失败!' + errinfo[err.errcode]
                            });
                        })
                    }
                }).catch(() => {
                    target.status = !isEnable
                });
            }
        }
    }
</script>
