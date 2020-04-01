<template>
    <div>
        <el-form :model="regForm" status-icon :rules="rules" ref="regForm" label-width="100px" class="reg-container"
                 v-loading="loading" @keyup.enter.native="submitForm('regForm')">
            <div style="float: right">
                <router-link :to="{ path: '/' }">返回登录</router-link>
            </div>
            <h3 class="reg_title">用户注册</h3>
            <el-form-item label="用户名" prop="username" label-width="96px">
                <el-input v-model="regForm.username" autofocus></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone" label-width="96px">
                <el-input v-model="regForm.phone">
                    <el-button slot="append" type="text" :disabled="disabled" @click="getCount()"
                               style="text-align: center;margin: 0">{{count}}
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" label-width="96px">
                <el-input type="password" v-model="regForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2" label-width="96px">
                <el-input type="password" v-model="regForm.password2" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="输入验证码" prop="code" label-width="96px">
                <el-input v-model="regForm.code"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 40px;text-align: center">
                <el-button type="primary" @click="submitForm('regForm')">提交</el-button>
                <el-button @click="resetForm('regForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {

            let validatePass = (rule, value, callback) => {

                if (this.regForm.password2 !== '') {
                    this.$refs.regForm.validateField('password2');
                }
                callback();
            };
            let validatePass2 = (rule, value, callback) => {
                if (value !== this.regForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                regForm: {
                    username: "",
                    phone: '',
                    password: "",
                    password2: "",
                    code: ''
                },
                count: '获取验证码',
                loading: false,
                disabled: false,
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: ['blur']},
                        {
                            pattern: /^[a-zA-Z0-9_-]{4,16}$/,
                            message: '用户名由4-16个字母数字下划线或减号组成',
                            trigger: ['blur', 'change']
                        }
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: ['blur']},
                        {validator: validatePass, trigger: ['blur']},
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9~!@&%#_]{6,16}$/,
                            message: '密码长度为 6 到 16 个字符且必须包含大小写',
                            trigger: ['blur']
                        }

                    ],
                    password2: [
                        {required: true, message: '请再次输入密码', trigger: ['blur']},
                        {validator: validatePass2, trigger: ['blur']}
                    ],
                    phone: [
                        {required: true, message: '号码不能为空', trigger: 'blur'},
                        {
                            pattern: /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?([1][3-9]\d{9})))$/,
                            message: '请输入正确的电话号码',
                            trigger: 'blur'
                        }],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.postRequest("/reg", {
                            username: this.regForm.username,
                            password: this.regForm.password,
                            verifyCode: this.regForm.code,
                            phone: this.regForm.phone
                        }).then(resp => {
                            this.loading = false;
                            if (resp && resp.status === 200) {
                                this.$router.replace({path: '/'});
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getCount() {
                this.disabled = true
                this.count = 40
                setInterval(() => {
                    if (this.count > 0) {
                        this.count--
                    } else {
                        this.count = '获取验证码'
                        this.disabled = false
                    }
                }, 1200)
                this.axiosReqest('/verifyCode', {phone: this.regForm.phone}, 'post')
            }
        }
    }
</script>

<style scoped>
    .reg-container {
        border-radius: 10px;
        background-clip: padding-box;
        margin: 60px auto;
        width: 440px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 10px #cac6c6;
    }

    .reg_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
</style>
