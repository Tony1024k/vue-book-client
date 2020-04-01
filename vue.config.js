module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    //配置vue多页
    pages: {
        loginReg: {
            // 应用入口配置，相当于单页面应用的main.js，必需项
            entry: "src/views/loginReg/index.js",
            // 应用的模版来源，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
            template: "public/loginReg.html",
            // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
            filename: "loginReg.html",
            // 标题，可选项，一般情况不使用，通常是在路由切换时设置title
            // 需要注意的是使用title属性template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: "Login Page",
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', "loginReg"]
        },
        index: {
            // 应用入口配置，相当于单页面应用的main.js，必需项
            entry: "src/main.js",
            // 应用的模版来源，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
            template: "public/index.html",
            // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
            filename: "index.html",
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', "index"]
        }
    },
    // 所有 webpack-dev-server 的选项都支持
    devServer: {
        proxy: {
            '/': {
                target: 'http://127.0.0.1:8088',   //代理接口
                changeOrigin: false,
                pathRewrite: {
                    '^/': ''    //代理的路径
                },
                ws: false
            }
        }
    },
}
