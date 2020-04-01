import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home';
import Goods from "@/components/Goods";
import Order from "@/components/Order";
import Cart from "@/components/Cart";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            children: [{
                path: '/',
                name: 'goods',
                component: Goods
            }, {
                path: '/cart',
                name: 'cart',
                component: Cart
            }, {
                path: '/order',
                name: 'order',
                component: Order
            }]
        }

    ]
})
