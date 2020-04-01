<template>
    <div class="head-toolbar">
        <div class="head-toolbar-left">
            <div class="toolbar-left-node">
                <a href="javascript:void(0)">
                    <span>欢迎访问</span>
                </a>
            </div>
            <div class="toolbar-left-node">
                <a href="javascript:void(0)" @click="goToHome()">
                    <span>返回首页</span>
                </a>
            </div>
        </div>
        <div class="head-toolbar-right">
            <div class="toolbar-right-node" v-if="!user.id">
                <a href="/loginReg.html"><span>请登录</span></a>
            </div>
            <div v-else class="toolbar-right-node">
                <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

            <div class="toolbar-right-node">
                <a href="javascript:void(0)">
                    <a href="/loginReg.html#/reg"><span>注册</span></a>
                </a>
            </div>
            <div class="toolbar-right-node">
                <router-link to="/order">
                    <span>我的订单</span>
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "ToolBar",
        methods: {
            goToHome() {
                this.$router.replace('/').catch(() => {
                })
                this.$router.go(0)
            },
            handleCommand(command) {
                if (command === 'logout') {
                    this.axiosReqest('/logout', {}, 'get').then((resp) => {
                        if (resp.status === 200) {
                            sessionStorage.clear()
                            setTimeout(() => {
                                window.open('/', '_self')
                            }, 1000)
                        }
                    })
                }
            }
        },
        computed: {
            ...mapGetters(['user', 'cart']),
        }
    }
</script>

<style scoped>
    .head-toolbar {
        width: 1100px;
        line-height: 35px;
        height: 35px;
        border-bottom: 1px solid #eee;
        background: #f5f5f5;
        margin: auto;
    }

    .head-toolbar-left {
        float: left;
        overflow: hidden;
    }

    .toolbar-left-node {
        float: left;
        padding: 0 10px;
        overflow: hidden;
    }

    .head-toolbar-right {
        float: right;
        padding: 0 10px;
        overflow: hidden;
    }

    .toolbar-right-node {
        float: left;
        padding: 0 10px;
        overflow: hidden;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>
