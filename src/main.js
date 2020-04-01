import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import {axiosReqest} from './utils/request'
import {postRequest} from './utils/request'

Vue.config.productionTip = false
Vue.prototype.axiosReqest = axiosReqest;
Vue.prototype.postRequest = postRequest;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')


