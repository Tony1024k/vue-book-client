import {axiosReqest} from "@/utils/request";
import jsCookie from 'js-cookie'

const user = {

    state: {
        user: {
            id: '',
            username: '',
            password: '',
            gender: '',
            age: '',
            idCard: '',
            email: '',
            phone: '',
            address: '',
            shoppingCart: {id: '', cartItems: []}
        },
        addrList: [{id: '', address: '', phone: '', postcode: '', consignee: ''}],
        order: {
            id: '',
            orderNumber: '',
            user: {},
            shippingAddr: '',
            orderItems: [],
            status: '',
            finalPrice: '',
            totalPrice: '',
            payTime: '',
            shipTime: '',
            confirmTime: '',
        },
        keywords: ''
    },
    mutations: {
        SET_USER: (state, user) => {
            state.user = user
            sessionStorage.setItem('user', JSON.stringify(user))
        },
        SET_USER_SHOPPINGCART: (state, shoppingCart) => {
            state.user.shoppingCart = shoppingCart
            sessionStorage.setItem('user', JSON.stringify(state.user))
        },
        setAddrList: (state, addrList) => {
            state.addrList = addrList
            sessionStorage.setItem('addrList', JSON.stringify(addrList))
        },
        setOrder: (state, order) => {
            state.order = order
            sessionStorage.setItem('order', JSON.stringify(order))
        },
        setKeywords: (state, keywords) => {
            state.keywords = keywords
        }
    },
    actions: {
        setUser: ({commit}, user) => {
            commit('SET_USER', user)
        },
        setShoppingCart: async ({state, commit}, cart) => {

            cart.id = state.user.shoppingCart.id
            if (state.user.id && cart.cartItems.length) {
                await axiosReqest('/cart/save', cart, 'post').then(async (ret) => {
                    if (ret && ret.status === 200 && ret.data.id) {
                        await commit('SET_USER_SHOPPINGCART', ret.data)
                    }
                })
            } else if (!state.user.id && cart.cartItems.length) {
                let ids = '';
                cart.cartItems.forEach((item) => {
                    ids += item.book.id + ','
                })
                await axiosReqest('/book/getByIds', {ids: ids}, 'get').then(async (ret) => {
                    if (ret && ret.status === 200 && ret.data instanceof Array) {
                        ret.data.forEach((item) => {
                            cart.cartItems.forEach((item2) => {
                                if (item2.book.id === item.id) {
                                    item2.book = item;
                                }
                            })
                        })
                        await commit('SET_USER_SHOPPINGCART', cart)
                    }
                })
            } else {
                return new Promise(async (resolve) => {
                    await commit('SET_USER_SHOPPINGCART', cart)
                    resolve()
                })
            }
        },
        addCartItem: async ({state, dispatch}, cartItem) => {
            if (state.user.id) {
                let cart = {...state.user.shoppingCart};
                let isAdd = true;
                cart.cartItems.forEach((item) => {
                    if (item.book.id === cartItem.book.id) {
                        item.count = cartItem.count
                        isAdd = false
                    }
                })
                if (isAdd) {
                    cart.cartItems.push({id: cartItem.id, book: {id: cartItem.book.id}, count: cartItem.count})
                }
                await dispatch('setShoppingCart', cart);


            } else {
                let cookieCart = jsCookie.getJSON('cart');
                let isAdd = true;
                for (let item1 of cookieCart.cartItems) {
                    if (item1.book.id === cartItem.book.id) {
                        item1.count = cartItem.count
                        isAdd = false
                    }
                }
                if (isAdd) {
                    cookieCart.cartItems.push({id: cartItem.id, book: {id: cartItem.book.id}, count: cartItem.count})
                }
                jsCookie.set('cart', cookieCart, {expires: 5})

                isAdd = true
                let cartItems = [...state.user.shoppingCart.cartItems];
                for (let item of cartItems) {
                    if (item.book.id === cartItem.book.id) {
                        item.count = cartItem.count;
                        isAdd = false;
                    }
                }
                if (isAdd) {
                    cartItems.push(cartItem)
                }

                await dispatch('setShoppingCart', {id: state.user.shoppingCart.id, cartItems: cartItems});
            }
        },
        delCartItem: async ({state, dispatch}, book) => {
            if (state.user.id) {
                let cart = {...state.user.shoppingCart};
                let cartItem = cart.cartItems.find((item) => {
                    return item.book.id === book.id
                });
                cart.cartItems = cart.cartItems.filter((item) => {
                    return item.book.id !== book.id
                });
                await axiosReqest('/cartItem/delete', {id: cartItem.id}, 'get').then(async (resp) => {
                    if (resp && resp.status === 200) {
                        await dispatch('setShoppingCart', cart)
                    }
                })

            } else {
                let cart = {...state.user.shoppingCart};
                cart.cartItems = cart.cartItems.filter((item) => {
                    return item.book.id !== book.id
                });

                let cookieCart = jsCookie.getJSON('cart');
                cookieCart.cartItems = cookieCart.cartItems.filter((item) => {
                    return item.book.id !== book.id
                });

                jsCookie.set('cart', cookieCart, {expires: 5})
                await dispatch('setShoppingCart', cart);

            }
        },
        async setAddrList({commit}, addrList) {
            await commit('setAddrList', addrList)
        }
    },

};

export default user
