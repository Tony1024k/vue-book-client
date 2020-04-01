<template>
    <el-form :model="loginForm" :rules="rules" class="login-container" ref="loginForm" label-position="left"
             label-width="0px" v-loading="loading" @keyup.enter.native="submitClick('loginForm')">
        <div style="float: right">
            <router-link :to="{ path: '/reg' }">注册</router-link>
        </div>
        <h3 class="login_title">系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"
                      autofocus></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%;margin-top: 50px">
            <el-button type="primary" style="width: 100%" @click="submitClick('loginForm')">登录</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    export default {
        data() {
            return {
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                },
                checked: true,
                loginForm: {
                    username: 'admin',
                    password: 'Aa1234'
                },
                loading: false
            }
        },
        methods: {
            submitClick(formName) {
                this.loading = true;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axiosReqest('/login', {
                            username: this.loginForm.username,
                            password: this.loginForm.password,
                        }, 'post').then(resp => {
                            this.loading = false;
                            if (resp && resp.status === 200 && resp.data.obj) {
                                setTimeout(() => {
                                    window.open('/', '_self')
                                }, 1000)
                            }
                        }).catch(() => {
                            this.loading = false;
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            }
        }
    }
</script>
<style>
    .login-container {
        border-radius: 10px;
        background-clip: padding-box;
        margin: 80px auto;
        width: 350px;
        padding: 30px 40px 20px 40px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 10px #cac6c6;
    }

    .login_title {
        margin: 10px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .login_remember {
        text-align: left;
    }
</style>
