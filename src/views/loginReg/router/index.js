import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/views/loginReg/components/Login";
import Register from "@/views/loginReg/components/Register";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,
        },
        {
            path: '/reg',
            name: 'reg',
            component: Register
        }

    ]
})
