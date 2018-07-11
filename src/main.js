import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueClipboards from 'vue-clipboards';
import { Message } from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
// import '../static/css/gay-pink.css';       // 基佬粉
// import '../static/css/theme-green/fire.css';       // 火红
import '../static/css/theme-green/blue.css';       // 官方蓝
import api from './api'
import errinfo from './errinfo'

import filters from './filters'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// Vue.use(VueQuillEditor)
Vue.use(ElementUI)
Vue.use(VueClipboards)

Vue.prototype.$api = api
Vue.prototype.$error = function (errcode) {
    Message({
        showClose: true,
        message: errinfo[errcode],
        type: 'error'
    })
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
