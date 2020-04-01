<template>
    <div>
        <div class="title">
            <el-link href="/" :underline="false" style="font-size: 20px;color: #666">网上图书商城</el-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>
    .title {
        width: 500px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        margin: 30px auto 0px;
    }
</style>
