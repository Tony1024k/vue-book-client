const getters = {
    user: state => {
        let sessionUser = JSON.parse(sessionStorage.getItem('user'))
        if (!state.user.user.id && sessionUser && sessionUser.id) {
            state.user.user = sessionUser
        }
        return state.user.user
    },
    cart: state => {
        return state.user.user.shoppingCart
    },
    addrList(state) {
        let addrList = JSON.parse(sessionStorage.getItem('addrList'))
        if (!state.user.addrList.id && addrList && addrList.id) {
            state.user.addrList = addrList
        }
        return state.user.addrList
    }
}

export default getters
