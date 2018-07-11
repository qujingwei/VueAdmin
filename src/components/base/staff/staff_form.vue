<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-form :model="staffForm" :rules="rules" ref="staffForm" label-width="100px">
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="staffForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="realname">
                        <el-input v-model="staffForm.realname"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input type="email" v-model="staffForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="branchid">
                        <el-select v-model="staffForm.branchid" placeholder="请选择员工所属部门">
                            <el-option :label="branch.name" v-for="branch in branch_list" :value="branch.branchid"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="createStaff()">立即创建</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                staffForm: {
                    staffid:  "",
                    email:    "",
                    faceimg:  "",
                    password: "",
                    realname: "",
                    branchid: '1',
                    regtime:  "",
                    staffid:  "",
                    status:   "",
                    username: "",
                },
                rules: {
                    username: [
                        { required: true, message: '请正确输入员工账号', trigger: 'blur' }
                    ],
                    realname: [
                        { required: true, message: '员工姓名不能为空', trigger: 'blur' }
                    ],
                    branchid: [
                        { required: true, message: '员工所属部门不能为空', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入员工邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                },
                branch_list: []
            }
        },
        created() {
            this.getAllBranch()
        },
        methods: {
            createStaff(){
                this.$refs['staffForm'].validate((valid) => {
                    if (valid) {
                        this.$api.staff.create(this.staffForm).then( data => {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.$router.push('/staff/staff_list')
                        }).catch( err => {
                            this.$error(err.errinfo)
                        })
                    }else{
                        console.log(valid)
                    }
                })
            },
            getAllBranch() {
                this.$api.branch.page_list(1, 1000).then(data => {
                    // this.total = data.total
                    this.branch_list = data.data
                }).catch(err => {
                    this.$error(err.errinfo)
                })
            },
            handleAreaChange(a){

            }
        }
    }
</script>
