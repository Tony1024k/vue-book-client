
export const mergeCart = (cartA, cartB) => {
    for (let item of cartB.cartItems) {
        let m = 0;
        for (let i of cartA.cartItems) {
            if (i.book.id === item.book.id) {
                i.count += item.count;
                m = 1
            }
        }
        if (!m) {
            cartA.cartItems.push(item);
        }
    }
}
