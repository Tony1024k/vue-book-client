<template>
    <div class="order-list">
        <div class="order_bd">
            <table class="order_table">
                <colgroup>
                    <col class="number-col">
                    <col class="consignee-col">
                    <col class="amount-col">
                    <col class="status-col">
                </colgroup>
                <thead>
                <tr>
                    <th>订单详情</th>
                    <th>收货人</th>
                    <th>金额</th>
                    <th>状态</th>
                </tr>
                </thead>
                <tbody v-for="(order,index) in orderList" :key="index">
                <tr>
                    <th colspan="4">
                        <el-row>
                            <el-col :span="22">
                                <div class="split-row">
                                    {{order.createTime}} &nbsp;&nbsp; 订单号：{{order.orderNumber}}
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="split-row-del">
                                    <el-button type="text" @click="delOrder(order.id)">删除</el-button>
                                </div>
                            </el-col>
                        </el-row>

                    </th>
                </tr>
                <tr v-for="(orderItem,i) in order.orderItems" :key="i" class="tr-bd">
                    <td>
                        <div class="goods-item">
                            <el-row>
                                <el-col :span="4">
                                    <div>
                                        <el-image
                                                :src="orderItem.book.pictureUrl"
                                                style="width: 60px;height: 60px;">
                                        </el-image>
                                    </div>
                                </el-col>
                                <el-col :span="12" class="p-name">
                                    {{orderItem.book.name}}
                                </el-col>
                                <el-col :span="6">
                                    {{orderItem.quantity}}
                                </el-col>
                            </el-row>
                        </div>
                    </td>
                    <td v-if="i===0" :rowspan="order.orderItems.length">{{order.shippingAddr.consignee}}</td>
                    <td v-if="i===0" :rowspan="order.orderItems.length">{{order.finalPrice}}</td>
                    <td v-if="i===0" :rowspan="order.orderItems.length">{{status[order.status]}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="order-page">
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

    </div>
</template>

<script>
    import {axiosReqest} from "@/utils/request";
    import {mapGetters} from "vuex";

    export default {
        name: "Order",
        data() {
            return {
                orderList: [],
                totalPages: 1,
                page: 1,
                size: 4,
                status: ['待付款', '已完成']
            }
        },
        computed: {
            ...mapGetters(['cart', 'user']),
        },
        methods: {
            getOrders() {
                if (this.page > this.totalPages) {
                    this.page = this.totalPages
                }
                axiosReqest("/order/list", {
                    userId: this.user.id,
                    page: this.page - 1,
                    size: this.size
                }, "post").then((resp) => {
                    if (resp && resp.status === 200) {
                        this.orderList = resp.data.orders
                        this.totalPages = resp.data.totalPages
                    }
                })
            }
            ,
            handleSizeChange(val) {
                this.size = val;
                this.getOrders(this.page, this.size)
            }
            ,
            handleCurrentChange(val) {
                this.page = val;
                this.getOrders(this.page, this.size)
            },
            delOrder(orderId) {
                axiosReqest('/order/delete', {id: orderId}, 'get').then((resp) => {
                    if (resp.status === 200) {
                        this.$message.success('已删除')
                        this.getOrders()
                    }
                })
            },
        },
        mounted() {
            this.getOrders()
        },
    }
</script>

<style scoped>
    .order-list {
        margin: 0 auto;
        width: 1000px;
    }

    .order_bd {
        min-height: 440px;
        margin: 0 auto;
    }

    .order_table {
        border: 1px solid #e5e5e5;
        border-collapse: collapse;
        width: 100%;
        display: table;
        border-spacing: 2px;
    }

    .order_table td {
        border: 1px solid #e5e5e5;
        padding: 14px 0;
    }

    .order_table th {
        border: 1px solid #e5e5e5;
        padding: 6px 0;
    }

    .number-col {
        width: 590px;
    }

    .consignee-col {
        width: 110px;
    }

    .amount-col {
        width: 110px;
    }

    .status-col {
        width: 110px;
    }

    .tr-bd {
        text-align: center;
        vertical-align: top;
    }

    .goods-item {
        height: 62px;
        overflow: hidden;
    }

    .p-name {
        text-align: left;
        overflow: hidden;
        word-break: break-word;
        word-wrap: break-word;
        line-height: 20px;
    }

    .split-row {
        text-align: left;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        word-break: break-word;
        word-wrap: break-word;
    }

    .split-row-del {
        height: 30px;
        line-height: 30px;
        text-align: center;
        vertical-align: middle;
        overflow: hidden;
        word-break: break-word;
        word-wrap: break-word;
    }

    .order-page {
        float: right;
        margin: 50px 0 50px;
        font: 12px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB, "\u5b8b\u4f53", sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #666;
    }

</style>
