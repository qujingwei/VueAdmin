export default {
    auth_info:(state, data) => {
        data.peerid && (state.auth_info.peerid = data.peerid)
        data.sessionid && (state.auth_info.sessionid = data.sessionid)
        data.username && (state.auth_info.username = data.username)
    },
    user_info:(state, data) => {
        state.user_info = data
    },
    logout:(state, data) => {
        state.auth_info.sessionid = ''
    },
    menu:(state, data) => {
        state.menu = data
    },
}
