<template>
    <div class="goods-list">
        <el-row style="min-height: 360px;">
            <el-col v-for="(book, index) in books" :key="index" class="gl-col" :span="6">
                <el-card shadow="hover" class="gl-card">
                    <div class="clearfix">
                        <div class="gl-card-image" @click="showBookDetails(book)">
                            <img style="width: 160px;height: 160px" :title="book.introduction" :src="book.pictureUrl">
                        </div>
                        <div class="gl-card-price clearfix">
                            <strong>
                                <em>￥</em>
                                <i>{{book.price}}</i>
                            </strong>
                        </div>
                        <div class="gl-card-name" @click="showBookDetails(book)">
                            <span :title="book.introduction">
                                <em>
                                    {{book.name}}
                                </em>
                                <i style="color: #ffaa71">
                                    {{book.introduction}}
                                </i>
                            </span>
                        </div>
                        <div class="gl-card-press">{{book.press}}</div>
                        <div class="gl-card-button">
                            <el-button @click="addToCart(book)" size="small" plain>加入购物车
                            </el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="gl-page">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[12, 24, 48, 96]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="totalPages">
            </el-pagination>
        </div>
        <div>
            <el-dialog title="商品详情" :visible.sync="isVisible">
                <div>
                    <el-row>
                        <el-col :span="12">
                            <el-image class="book-img" :src="book.pictureUrl"></el-image>
                        </el-col>
                        <el-col :span="12" class="book-info">
                            <div><span><em>{{book.name}}</em></span></div>
                            <div>
                                图书简介：
                                <i style="color: #ffaa71">
                                    {{book.introduction}}
                                </i>
                            </div>
                            <div><span>图书作者：{{book.author}}</span></div>
                            <div><span>ISBN：{{book.isbn}}</span></div>
                            <div><span>出版社：{{book.press}}</span></div>
                            <div><span>上市年份：{{book.year}}</span></div>
                            <div><span>库存：{{book.stock}}</span></div>
                            <div>
                                <span>
                                    价格：
                                    <strong style="color: #e4393c;font-weight: 400;font-family: Verdana,sans-serif;font-size: 20px">
                                    <em>￥</em>
                                    <i>{{book.price}}</i>
                                </strong>
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="isVisible = false">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from "vuex";
    import {axiosReqest} from "@/utils/request";

    export default {
        data() {
            return {
                book: {
                    id: '',
                    name: '',
                    author: '',
                    introduction: '',
                    isbn: '',
                    stock: '',
                    price: '',
                    pictureUrl: '',
                    press: '',
                    year: ''
                },
                books: [],
                totalPages: 1,
                page: 1,
                size: 12,
                promiseQueue: '',
                isVisible: false
            }
        },

        mounted() {
            //console.log(this.$store.state)
            this.promiseQueue = new Promise(async (resolve) => {
                await this.searchBook(this.keywords, this.page, this.size)
                resolve()
            })
        },

        methods: {
            ...mapActions(['setUser', 'setShoppingCart', 'addCartItem', 'delCartItem']),
            showBookDetails(book) {
                this.book = book
                this.isVisible = true
            },
            addToCart(book) {
                this.promiseQueue = this.promiseQueue.then(async () => {
                    let item = {id: '', book: book, count: 1};
                    for (let i of this.cart.cartItems) {
                        if (i.book.id === book.id) {
                            item.id = i.id;
                            item.count += i.count;
                            item.book = book;
                        }
                    }
                    await this.addCartItem(item).then(async () => {
                        await this.$message.success('已添加')
                    });
                })
            },
            async searchBook(keywords, page, size) {
                await axiosReqest('/book/search', {
                    keywords: keywords,
                    page: page - 1,
                    size: size
                }, 'get').then(resp => {
                    if (resp && resp.status === 200) {
                        this.books = resp.data.books;
                        this.totalPages = resp.data.totalPages;
                    }
                })
            },
            handleSizeChange(val) {
                this.size = val;
                this.searchBook(this.keywords, this.page, this.size)
            },
            handleCurrentChange(val) {
                this.page = val;
                this.searchBook(this.keywords, this.page, this.size)
            },

        },
        computed: {
            ...mapGetters(['user', 'cart']),
            ...mapState({keywords: state => state.user.keywords})
        },
        watch: {
            keywords(keywords) {
                this.searchBook(keywords, 1, 12)
            }
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .goods-list {
        width: 1060px;
        min-height: 500px;
        overflow: hidden;
        margin: auto;
    }

    .gl-col {

        width: 254px;
        height: 364px;
        margin: 4px;
    }

    .gl-card {
        width: 250px;
        height: 360px;
        overflow: hidden;

    }

    .gl-card-image {
        text-align: center;
        margin-bottom: 18px;
        overflow: hidden;
        display: block;
        cursor: pointer;
    }

    .gl-card-price {
        margin-bottom: 14px;
    }

    .gl-card-price strong {

        color: #e4393c;
        font-weight: 400;
        font-family: Verdana, sans-serif;
        float: left;
        margin-right: 10px;
        font-size: 20px;
    }

    .gl-card-name {
        height: 38px;
        margin-bottom: 16px;
        word-break: break-all;
        word-wrap: break-word;
        overflow: hidden;
        cursor: pointer;
    }

    .gl-card-press {
        color: #999;
        height: 18px;
        line-height: 18px;
        padding-right: 20px;
        margin-right: 10px;
        margin-bottom: 8px;
        word-break: break-all;
        word-wrap: break-word;
        overflow: hidden;
    }

    .gl-card-button {
        float: right;
    }

    .gl-page {
        float: right;
        margin: 50px 0 50px;
        font: 12px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB, "\u5b8b\u4f53", sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #666;
    }

    .clearfix:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .book-img {
        border: 1px solid #eee;
        width: 300px;
        height: 300px;
    }

    .book-info div {
        line-height: 20px;
        max-height: 80px;
        margin: 6px 0;
        word-break: break-all;
        word-wrap: break-word;
        overflow: hidden;
    }

</style>
