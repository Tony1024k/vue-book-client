<template>
    <div>
        <div class="order_addr ">
            <div class="addr_title">
                <h3>选择收货地：</h3>
            </div>
            <div class="addr_bd clearfix">
                <div class="addr_content">
                    <el-select v-model="selected" placeholder="请选择" style="width: 830px" filterable :value="selected">
                        <el-option v-for="(addr,index) in this.addrList" :key="index" :label="addr.address"
                                   :value="addr.id">
                            <span class="addr_select_option" style="float: left;" :title="addr.address">
                                {{ addr.address }}
                            </span>
                            <span style="float: right; color: #8492a6; font-size: 13px">
                                收货人：{{ addr.consignee }}
                            </span>
                        </el-option>
                    </el-select>
                </div>
                <div class="addr_action clearfix">
                    <div class="addr_add">
                        <el-button type="text" @click="addAddr()">新增</el-button>
                    </div>
                    <div class="addr_modify">
                        <el-button type="text" @click="modifyAddr()">修改</el-button>
                    </div>
                </div>
                <div>
                    <!-- Form -->
                    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="600px">
                        <el-form :model="addrForm" ref="addrForm" :rules="rules">
                            <el-form-item label="收货人" :label-width="formLabelWidth" prop="consignee">
                                <el-input v-model="addrForm.consignee" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address">
                                <el-input v-model="addrForm.address"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
                                <el-input v-model="addrForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="邮编" :label-width="formLabelWidth">
                                <el-input v-model="addrForm.postcode"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="oncancel()">取 消</el-button>
                            <el-button type="primary" @click="onSubmit('addrForm')">确 定</el-button>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </div>
        <div class="order_list">
            <div class="order_head">
                <el-row>
                    <el-col class="head_col" :span="12">商品</el-col>
                    <el-col class="head_col" :span="4">单价</el-col>
                    <el-col class="head_col" :span="4">数量</el-col>
                    <el-col class="head_col" :span="4">小计</el-col>
                </el-row>
            </div>
            <div class="list_bd">
                <el-row class="list_row" v-for="item in this.cart.cartItems" :key="item.book.id">
                    <el-col class="list_col" :span="12">
                        <el-row>
                            <el-col class="list_info" :span="8">
                                <div class="list_info_img">
                                    <a :href="item.book.pictureUrl">
                                        <img style="width: 100px;height: 100px; border: 1px solid #eee;"
                                             :src="item.book.pictureUrl">
                                    </a>
                                </div>
                            </el-col>
                            <el-col :span="10" class="list_info">
                                <span>{{item.book.name}}</span>
                            </el-col>
                            <el-col :span="6" class="list_info">
                                <span>{{item.book.press}}</span>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col class="list_col" :span="4">
                        <span>{{item.book.price}}</span>
                    </el-col>
                    <el-col class="list_col" :span="4">
                        <span>{{item.count}}</span>
                    </el-col>
                    <el-col class="list_col" :span="4">
                        <span>
                            <strong>{{(item.count*item.book.price).toFixed(2)}}</strong>
                        </span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="list_footer clearfix">
            <div class="footer_addr">
                <span class="footer_addr_info">寄送至： </span>
                <span class="footer_addr_content">
                    {{addrForm.address}}&nbsp;&nbsp;{{addrForm.consignee}}&nbsp;&nbsp;手机号码：{{addrForm.phone}}
                </span>
            </div>

            <div class="footer_commit">
                <el-button class="footer_button" @click="submitOrder()">提交订单</el-button>
            </div>

            <div class="footer_total">
                <span class="price_title">应付总额：</span>
                <span class="price_num">{{total}}</span>
            </div>
        </div>
    </div>

</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {axiosReqest} from "@/utils/request";

    export default {
        name: "Cart",
        data() {
            return {
                selected: '',
                addrForm: {id: '', user: {id: ''}, address: '', phone: '', postcode: '', consignee: ''},
                formBak: {},
                formTitle: '',
                formLabelWidth: '110px',
                dialogFormVisible: false,
                rules: {
                    consignee: [{required: true, message: '请填写收货人', trigger: ['blur']}],
                    address: [{required: true, message: '请填写收货地址', trigger: ['blur']}],
                    phone: [{required: true, message: '请填写手机号码', trigger: 'blur'}, {
                        pattern: /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?([1][3-9]\d{9})))$/,
                        message: '请输入正确的电话号码',
                        trigger: 'blur'
                    }]
                },
                order: {
                    id: '',
                    orderNumber: '',
                    user: {id: ''},
                    shippingAddr: {id: ''},
                    orderItems: [],
                    status: '',
                    finalPrice: '',
                    totalPrice: '',
                    payTime: '',
                    shipTime: '',
                    confirmTime: ''
                },
            }
        },
        methods: {
            ...mapActions(['setAddrList', 'setShoppingCart']),
            init() {
                axiosReqest('/address/addrList', {id: this.user.id}, 'get').then((resp) => {
                    if (resp && resp.status === 200 && resp.data instanceof Array && resp.data.length) {
                        this.$store.commit('setAddrList', [...resp.data])
                        this.addrForm = resp.data[0]
                        this.selected = resp.data[0].id
                    }
                })
            },
            addAddr() {
                this.formBak = this.addrForm
                this.addrForm = {}
                this.formTitle = "新增收货信息"
                this.dialogFormVisible = true;
            },
            modifyAddr() {
                this.formTitle = "修改收货信息"
                for (let addr of this.addrList) {
                    if (addr.id === this.selected) {
                        this.addrForm = {...addr};
                    }
                }
                this.dialogFormVisible = true;
            },
            oncancel() {
                this.addrForm = this.formBak;
                this.dialogFormVisible = false;
            },
            onSubmit(addrForm) {
                this.$refs[addrForm].validate((valid) => {
                    if (valid) {
                        this.addrForm.user = {id: this.user.id}
                        axiosReqest('/address/save', this.addrForm, 'post').then((resp) => {
                            if (resp && resp.status === 200) {
                                this.init()
                                if (this.formTitle.includes('新增收货信息')) {
                                    this.$message.success('添加成功')
                                } else {
                                    this.$message.success('修改成功')
                                }
                            }
                        }).catch((resp) => {
                            this.$message.success('错误： ' + resp.status)
                        })
                        this.dialogFormVisible = false
                    } else {
                        this.$message.success('操作有误！')
                        return false
                    }
                })
            },
            submitOrder() {
                if (this.user.id) {
                    this.order.user.id = this.user.id
                    this.order.finalPrice = this.total
                    this.order.shippingAddr.id = this.selected
                    this.order.status = 0
                    for (let item of this.cart.cartItems) {
                        this.order.orderItems.push({id: '', book: {id: item.book.id}, quantity: item.count})
                    }
                    axiosReqest('/order/save', this.order, 'post').then(async (resp) => {
                        if (resp.status === 200) {
                            this.$message.success('提交成功')
                            await axiosReqest('/cart/clear', {cartId: this.cart.id}, 'get').then((resp) => {
                                this.setShoppingCart({id: '', cartItems: []}).then((ret) => {
                                    this.$router.replace('/order').then()
                                })
                            })
                        }
                    }).catch((resp) => {
                        this.$message('错误：' + resp.status)
                    })

                } else {
                    this.$message.error('请先登录!')
                }
            }
        },

        computed: {
            ...mapGetters(['cart', 'user', 'addrList']),
            total() {
                let total = 0;
                for (let item of this.cart.cartItems) {
                    total += item.count * item.book.price
                }
                return total.toFixed(2)
            },
        },
        mounted() {
            this.init();
        }
    }

</script>

<style scoped>
    .order_addr {
        margin: auto;
        width: 1060px;
        height: 70px;
        overflow: hidden;
        font-size: 14px;
    }

    .addr_title {
        height: 20px;
        line-height: 20px;
    }

    .addr_bd {
        height: 40px;
        line-height: 40px;
        overflow: hidden;

    }

    .addr_content {
        margin-left: 20px;
        width: 830px;
        float: left;
        word-wrap: break-word;
        word-break: break-word;
    }

    .addr_select_option {
        display: inline-block;
        width: 680px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .addr_action {
        width: 180px;
        float: right;
        overflow: hidden;
        text-align: center;
        height: 40px;
        line-height: 40px;
    }

    .addr_modify {
        width: 40px;
        float: left;
    }

    .addr_add {
        width: 40px;
        float: left;
    }

    .order_list {
        width: 1050px;
        min-height: 400px;
        margin: 0 auto;
        overflow: hidden;
    }

    .order_head {
        width: 1040px;
    }

    .order_head .head_col {
        text-align: center;
        vertical-align: center;
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        background: #f3f3f3;
        border: 1px solid #e9e9e9;
    }

    .list_bd {
        width: 1040px;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 500px;
        background: #fff4e8;
    }

    .list_row {
        width: 1040px;
        margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #c5c5c5;
    }

    .list_col {
        height: 100px;
        line-height: 100px;
        vertical-align: middle;
        text-align: center;
        word-wrap: break-word;
        word-break: break-word;
        overflow: hidden;

    }

    .list_info {
        height: 100px;
        line-height: 100px;
        text-align: left;
        word-wrap: break-word;
        word-break: break-word;
        text-overflow: ellipsis;
    }


    .list_info_img {
        text-align: center;
        overflow: hidden;
    }

    .list_col span, .list_info span {
        display: inline-block;
        margin-right: 15px;
        font-size: 14px;
        line-height: 16px;
        vertical-align: middle;
    }

    .list_footer {
        height: 56px;
        line-height: 56px;
        position: -webkit-sticky;
        position: sticky;
        bottom: 0;
        width: 1050px;
        background: #fff;
        margin: 10px auto 10px;
        overflow: hidden;
    }

    .footer_addr {
        float: left;
        width: 750px;
        height: 56px;
        line-height: 56px;
        overflow: hidden;
    }

    .footer_addr_info {
        display: inline-block;
        width: 60px;
        line-height: 16px;
        vertical-align: middle;
        color: #555;
    }

    .footer_addr_content {
        display: inline-block;
        width: 684px;
        line-height: 16px;
        vertical-align: middle;
        word-wrap: break-word;
        word-break: break-word;
    }

    .footer_total {
        margin-right: 12px;
        height: 56px;
        line-height: 56px;
        float: right;

    }

    .price_title {
        line-height: 25px;
        color: #555;
        vertical-align: middle;
    }

    .price_num {
        color: #e4393c;
        font-family: Verdana, serif;
        font-weight: 700;
        font-size: 18px;
        min-width: 122px;
        _width: 122px;
        text-align: center;
        line-height: 25px;
        vertical-align: middle;
    }

    .footer_commit {
        float: right;
        overflow: hidden;
        width: 110px;
        height: 56px;
        line-height: 60px;
        margin-right: 20px;
    }

    .footer_button {
        width: 110px;
        height: 36px;
        line-height: 36px;
        margin: 8px 10px 0 0;
        padding: 0;
        background-color: #e00;
        color: #fff;
        font-weight: 700;
        font-size: 16px;
        font-family: arial, "Microsoft YaHei", serif;
        border-radius: 3px;
        cursor: pointer;
        border: 0;
    }

    .clearfix:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
</style>
