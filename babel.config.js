module.exports = {
    presets: [
        '@vue/app'
    ],
    plugins: ["@babel/plugin-transform-runtime","@babel/plugin-proposal-object-rest-spread"],
    comments: false,
    env: {
        test: {
            presets: ["@babel/preset-env"],
            plugins: ["istanbul"]
        }
    }
}
