<template>
    <div>
        <el-container>
            <el-header style="height: 110px">
                <div class="head-search">
                    <div class="search-img">
                        <a href="//www.jd.com/" class="logo">京东</a>
                    </div>
                    <div class="search-input">
                        <el-input placeholder="请输入内容" v-model="keywords">
                            <el-button @click="search()" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </div>

                    <div class="search-cart">
                        <el-dropdown :hide-on-click="false">
                                <span class="el-dropdown-link">
                                我的购物车
                                <i class="el-icon-shopping-cart-2 el-icon--right"></i>
                                </span>
                            <el-dropdown-menu slot="dropdown" style="width: 360px;border-color: #c81623;padding: 0">
                                <div class="cart_bd">
                                    <template v-for="(item,index) in this.cart.cartItems">
                                        <el-dropdown-item style="padding: 0; margin: 0" :key="index">
                                            <div class="cart_item cart_item_inner clearfix">
                                                <div class="cart_img">
                                                    <a class="cart_img_lk" href="//item.jd.com/10058164.html"
                                                       target="_blank">
                                                        <img :src="item.book.pictureUrl" width="50" height="50" alt="">
                                                    </a>
                                                </div>
                                                <div class="cart_name">
                                                    <a class="cart_name_lk" href="//item.jd.com/10058164.html"
                                                       :title="item.book.name" target="_blank">{{item.book.name}} </a>
                                                </div>
                                                <div class="item_count">
                                                    <el-input-number v-model="item.count"
                                                                     @change="addToCart(item)"
                                                                     :min="1"
                                                                     :max="999" label="描述文字"
                                                                     size="mini"
                                                                     style="line-height: 28px;width: 86px;">

                                                    </el-input-number>
                                                </div>
                                                <div class="cart_info">
                                                    <div class="cart_price">{{item.book.price}}</div>
                                                    <a class="cart_delete" @click="deleteItem(item.book)"
                                                       href="javascript:;">删除</a>
                                                </div>
                                            </div>
                                        </el-dropdown-item>
                                    </template>
                                    <div class="cart_ft clearfix">
                                        <div class="cart_ft_info">
                                            共<span class="cart_num">{{number}}</span>件商品 共计<span
                                                class="cart_num">¥ {{total}}</span>
                                        </div>
                                        <router-link to="cart">
                                            <a class="cart_ft_lk" href="//cart.jd.com/" title="去结算">去结算</a>
                                        </router-link>

                                    </div>
                                </div>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>
        </el-container>
        <router-view/>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import jsCookie from 'js-cookie'
    import {mergeCart} from "@/utils/mergeCart";

    export default {

        data() {
            return {
                loading: false,
                keywords: '',
            }
        },

        methods: {
            ...mapActions(['setUser', 'setShoppingCart', 'addCartItem', 'delCartItem']),
            addToCart(item) {
                this.addCartItem(item)
            },
            deleteItem(book) {
                if (!this.loading) {
                    this.loading = true
                    this.delCartItem(book).then(() => {
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                }

            },
            search() {
                this.$store.commit('setKeywords', this.keywords)
                //this.$router.replace('/').catch(data => {  })
            },
            initCart() {
                if (!this.user.id) {
                    if (!jsCookie.getJSON('cart')) {
                        let cart = {id: '', cartItems: []};
                        jsCookie.set('cart', cart, {expires: 5});
                    } else {
                        let cart = jsCookie.getJSON('cart');
                        this.setShoppingCart(cart)
                    }
                } else {
                    let cookieCart = jsCookie.getJSON('cart')
                    if (cookieCart && cookieCart.cartItems.length) {
                        let stateCart = {...this.cart};
                        mergeCart(stateCart, cookieCart);
                        this.setShoppingCart(stateCart).then(() => {
                            jsCookie.remove('cart');
                        });
                    }
                    jsCookie.remove('cart');
                }
            },
            initUser() {
                return this.axiosReqest('/user/currentUser', {}, 'get').then(async (resp) => {
                    if (resp && resp.status === 200 && resp.data.id) {
                        console.log(resp.data)
                        await this.setUser(resp.data)
                    }
                })
            }
        },

        computed: {
            ...mapGetters(['user', 'cart']),
            total() {
                let total = 0;
                if (this.cart && this.cart.cartItems.length) {
                    for (let item of this.cart.cartItems) {
                        total += item.count * item.book.price
                    }
                }
                return total.toFixed(2)
            },

            number() {
                let num = 0;
                if (this.cart && this.cart.cartItems.length) {
                    for (let item of this.cart.cartItems) {
                        num += item.count
                    }
                }
                return num
            }
        },

        mounted() {
            this.initUser().then(() => {
                this.initCart()
            })
        }

    }
</script>

<style scoped>
    .head-search {
        height: 110px;
        width: 1000px;
        margin: auto;
    }

    .search-img {
        float: left;
        width: 276px;
        height: 50px;
        margin: 15px 0 22px;
    }

    .logo {
        display: block;
        margin-top: 2px;
        width: 134px;
        height: 42px;
        background: url(//misc.360buyimg.com/jdf/1.0.0/unit/global-header/5.0.0/i/jdlogo-201708-@1x.png) no-repeat 0 0;
        background-size: 134px 42px;
        text-indent: -20000px;
    }

    .search-input {
        width: 420px;
        height: 24px;
        float: left;
        margin: 27px 30px 0 95px;
        top: 0;
    }

    .search-cart {
        float: left;
        height: 36px;
        margin-top: 27px;
        width: 100px;
        border: 1px solid #DFDFDF;
        padding: 0 10px 0 10px;
        background: #F9F9F9;
        line-height: 34px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .cart_bd {
        font-size: 12px;
        background: #fff;
        height: auto !important;
        max-height: 356px;
        overflow-y: auto;
    }

    .cart_item {
        line-height: 17px;
        vertical-align: bottom;
        background: #fff;
    }

    .cart_item_inner {
        padding: 8px 10px;
        overflow: hidden;
    }

    .cart_img {
        float: left;
        width: 50px;
        height: 50px;
        border: 1px solid #ddd;
        padding: 0;
        margin-right: 10px;
        font-size: 0;
        overflow: hidden;
    }

    .cart_name {
        padding: 1px;
        float: left;
        width: 124px;
        height: 52px;
        word-break: break-word;
        word-wrap: break-word;
        overflow: hidden;
    }

    .item_count {
        line-height: 52px;
        float: left;
        width: 88px;
        margin: 2px;
        overflow: hidden;
    }

    .cart_img_lk {
        display: block;
    }

    .cart_info {
        float: right;
        text-align: right;
        width: 40px;
    }

    .cart_price {
        font-weight: 700;
        margin: 2px;
    }

    .cart_delete, .cart_price {
        float: right;
        clear: both;
        max-width: 85px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .cart_ft {

        padding: 8px;
        background: #f5f5f5;
        text-align: right;
        overflow: hidden;
    }

    .cart_ft_info {
        float: left;
        line-height: 29px;
    }

    .cart_num {
        font-weight: 700;
    }

    .cart_ft_lk {
        float: right;
        height: 28px;
        padding: 0 10px;
        background: #e4393c;
        color: #fff;
        text-align: center;
        font-weight: 700;
        line-height: 29px;
        border-radius: 3px;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
    }

    .clearfix:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
</style>
