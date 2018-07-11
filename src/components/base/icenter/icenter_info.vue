<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="账号">
                    <el-input v-model="user_info.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="user_info.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="user_info.realname" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">保存</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                form: {
                    branchid: "",
                    email: "",
                    faceimg: "",
                    realname: "",
                    regtime: "",
                    staffid: "",
                    status: "",
                    username: ""
                }
            }
        },
        created() {

        },
        methods: {

        },
        computed: {
            ...mapGetters([
                'user_info'
            ])
        }

    }
</script>
