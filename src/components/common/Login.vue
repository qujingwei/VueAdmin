<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="checkcode">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-input type="text" placeholder="请输入验证码" v-model="loginForm.checkcode" @keyup.enter.native="login('loginForm')"></el-input>
                        </el-col>
                        <el-col :span="8" style="height: 36px;">
                            <img :src="captcha_url" alt="" @click="captcha()">
                        </el-col>
                    </el-row>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login('loginForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 你好，欢迎使用后台管理系统。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import md5 from 'md5'

    export default {
        data: function(){
            return {
                captcha_url: '',
                loginForm: {
                    username: '',
                    password: '',
                    checkcode: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    checkcode: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            if(!this.$store.state.auth_info.peerid){
                this.$api.common.peerid().then( res =>{
                    this.$store.commit('auth_info',{
                        peerid: res.peerid
                    })
                    this.$cookie.set('peerid',res.peerid,30)
                    this.captcha()
                })
            }else{
                this.captcha()
            }
        },
        methods: {
            login(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.common.login(this.loginForm.username, md5(this.loginForm.password), this.loginForm.checkcode).then( res =>{
                            this.$store.commit('auth_info',{
                                sessionid: res.sessionid
                            })
                            this.$store.commit('auth_info',{
                                username: res.username
                            })

                            this.$cookie.set('sessionid',res.sessionid,30)
                            this.$cookie.set('username',res.username,30)

                            this.$router.push('/index');
                        }).catch( err => {
                            console.log(err)
                            this.captcha()
                            this.loginForm.checkcode = ''
                            this.$error(err.errinfo);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            captcha(){
                this.$api.common.captcha().then( res => {
                    // console.log(res)
                    this.captcha_url = res.base64
                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: linear-gradient(135deg, #6ff5ff 0, #006eab 100%);
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:250px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }

    img{
        height:100%;
    }
</style>
