import axios from 'axios'
import {Message} from 'element-ui'
import qs from 'qs'

axios.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error({message: '请求超时!'});
    console.log(err);
    Promise.reject(err)
    // return Promise.resolve(err);
})
axios.interceptors.response.use(data => {
    if (data.status && data.status === 200 && data.data.status === 500) {
        Message.error({message: data.data.msg});
        return;
    }
    if (data.data.msg) {
        Message.success({message: data.data.msg});
    }
    return data;
}, err => {
    if (err.response.status === 504 || err.response.status === 404) {
        Message.error({message: '404，请求的页面不存在'});
    } else if (err.response.status === 403) {
        Message.error({message: '权限不足,请联系管理员!'});
    } else if (err.response.status === 401) {
        Message.error({message: err.response.data.msg});
    } else {
        if (err.response.data.msg) {
            Message.error({message: err.response.data.msg});
        } else {
            Message.error({message: '未知错误!'});
        }
    }
    // return Promise.resolve(err);
})
let base = '';
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            return qs.stringify(data, {
                allowDots: true
            })
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export const axiosReqest = (url, params, method) => {
    return axios({
        url: `${base}${url}`,
        method,
        params: method === "get" || method === 'delete' ? params : "",
        data: method === "post" || method === "put" ? params : "",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', //表单方式
            //'Content-Type': 'application/json' //json方式默认
            'charset': 'utf-8'
        },
        transformRequest: [function (data) {

            return qs.stringify(data, {
                allowDots: true
            })

        }]
        //baseURL: baseURL,
        //responseType: 'json', // 默认的
    })
}

export const uploadFileRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

