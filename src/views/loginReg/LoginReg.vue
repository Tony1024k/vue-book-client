<template>
    <div id="loginReg">
        <Header></Header>
        <router-view/>
    </div>
</template>

<script>
    import Header from "@/views/loginReg/components/Header";

    export default {
        name: 'loginReg',
        components: {Header}
    }
</script>

<style>
    body {
        font: 12px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB, "\u5b8b\u4f53", sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #666;
        background: #fff;
    }

    a, address, b, big, blockquote, body, center, cite, code, dd, del, div, dl, dt, em, fieldset, font, form, h1, h2, h3, h4, h5, h6, html, i, iframe, img, ins, label, legend, li, ol, p, pre, small, span, strong, u, ul, var {
        margin: 0;
        padding: 0;
    }

    em, i, u {
        font-style: normal;
    }

    a {
        color: #666;
        text-decoration: none;
    }


</style>
