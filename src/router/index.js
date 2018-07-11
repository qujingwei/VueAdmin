import Vue from 'vue';
import Router from 'vue-router';
import store from '../store'
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)
Vue.use(Router);

import baseRouter from './base'
import businessRouter from './business'

import Login from '../components/common/Login'
import Test from '../components/common/Test'
import Home from '../components/common/Home'
import _404 from '../components/common/404'

const childrenRouter = baseRouter.concat(businessRouter)
const router = new Router({
    routes: [
        {
            path: '/',
            component: Login,
        },

        {
            path: '/test',
            component: Test,
        },
        {
            path: '/index',
            component: Home,
            children: childrenRouter
        },
        {
            path: '*',
            component: _404,
        }
    ],

})

//init peerid and sessionid
let peerid = Vue.prototype.$cookie.get('peerid') || ''
let sessionid = Vue.prototype.$cookie.get('sessionid') || ''
let username = Vue.prototype.$cookie.get('username') || ''
peerid && store.commit('auth_info',{ peerid })
sessionid && store.commit('auth_info',{ sessionid })
username && store.commit('auth_info',{ username })


router.beforeEach((to, from, next) => {
    let peerid = store.state.auth_info.peerid
    let sessionid = store.state.auth_info.sessionid

    if(to.path === '/'){
        //去登录页
        if(peerid && sessionid){
            //已登录 跳转首页
            next('/index')
        }else{
            //登录态失效
            next()
        }
    }else{
        // 去其他页
        if(!peerid || !sessionid){
            //登录态失效 跳转首页
            next({
                path: '/',
                redirect: to.path
            })
        }else{
            // 已登录 跳转目标页
            next()
        }
    }
})

export default router
