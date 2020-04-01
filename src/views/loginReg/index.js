import Vue from 'vue'
import '@/plugins/axios'
import LoginReg from './LoginReg'
import '@/plugins/element.js'
import router from "./router"
import {axiosReqest} from '@/utils/request'
import {postRequest} from '@/utils/request'

Vue.config.productionTip = false
Vue.prototype.axiosReqest = axiosReqest;
Vue.prototype.postRequest = postRequest;

new Vue({
    router,
    render: h => h(LoginReg)
}).$mount('#loginReg')


