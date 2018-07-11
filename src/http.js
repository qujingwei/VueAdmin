import axios from 'axios'
import store from './store'
import router from './router'
import { API_BASEURL } from './config'
import qs from 'qs'

axios.defaults.timeout = 5000;
axios.defaults.baseURL = API_BASEURL;
// axios.defaults.baseURL = 'http://admin.riverwatcher.org.cn/api/';


axios.get = (url,params) => {
    return axios.request({
        url: url,
        method: 'get',
        params: params || {}
    })
}

// http request 拦截器
axios.interceptors.request.use(
    config => {
        let peerid = store.state.auth_info.peerid
        let sessionid = store.state.auth_info.sessionid

        if(config.method === 'get'){
            peerid && (config.params.peerid = peerid)
            sessionid && (config.params.sessionid = sessionid)
        }else if(config.method === 'post'){
            peerid && (config.data.peerid = peerid)
            sessionid && (config.data.sessionid = sessionid)
            config.data = qs.stringify(config.data)
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        let data = response.data
        if (data.errcode !== 0) {
            if(data.errcode === 4101){
                store.commit('logout');

                router.replace({
                    path: '/',
                    query: {redirect: router.currentRoute.fullPath}
                })
            }
            // if(data.errcode === 1){
            //     data.errcode = data.errinfo
            // }
            return Promise.reject(data)
        }
        return data.data;
    },
    error => {
        return Promise.reject({
            errcode: error.response.status || error.status
        })
    });

export default axios;
