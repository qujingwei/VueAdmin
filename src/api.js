import http from './http'

export default {

    common: {
        peerid(){
            return http.get('/common/peerid', { clienttype: 'admin' })
        },
        captcha(){
            return http.get('/common/captcha')
        },
        login(username, password, checkcode){
            return http.post('/common/login', { username, password, checkcode })
        },
        heartbeat(username){
            return http.get('/common/heartbeat', { username })
        },
        upload(file){
            return http.post('http://120.77.221.25:16820/admin', { file })
        }
    },
    icenter: {
        menu(){
            return http.get('/icenter/menu')
        },
        info(){
            return http.get('/icenter/info')
        },
        password_reset(){
            return http.post('/icenter/password_reset', { username, password, checkcode })
        }
    },
    branch: {
        page_list(pagenum, pagesize){
            return http.get('/branch/page_list', { pagenum, pagesize })
        },
        disable(branchid){
            return http.post('/branch/disable', { branchid })
        },
        enable(branchid){
            return http.post('/branch/enable', { branchid })
        },
        create(branch){
            return http.post('/branch/create', branch)
        },
        delete(branchid){
            return http.post('/branch/delete', { branchid })
        },
    },
    staff: {
        page_list(pagenum, pagesize){
            return http.get('/staff/page_list', { pagenum, pagesize })
        },
        disable(staffid){
            return http.post('/staff/disable', { staffid })
        },
        enable(staffid){
            return http.post('/staff/enable', { staffid })
        },
        create(staff){
            return http.post('/staff/create', staff)
        },
        delete(staffid){
            return http.post('/staff/delete', { staffid })
        },
        password_reset({ staffid, password }){
            return http.post('/staff/password_reset', { staffid, password })
        },
        branch_reset(branchid){
            return http.post('/staff/password_reset', { staffid, branchid })
        }
    },
    rbac: {
        role_list(){
            return http.get('/rbac/role_list')
        },
        role_add(name){
            return http.post('/rbac/role_add', { name })
        },
        role_delete(roleid){
            return http.post('/rbac/role_delete', { roleid })
        },
        menu_list(){
            return http.get('/rbac/menu_list')
        },
        menu_add({ menuid, upmenuid, name, dutyid }){
            return http.post('/rbac/menu_add', { upmenuid, name, dutyid, menuid })
        },
        menu_delete(menuid){
            return http.post('/rbac/menu_delete', { menuid })
        },
        menu_reload(){
            return http.post('/rbac/menu_reload', {})
        },
        duty_list(){
            return http.get('/rbac/duty_list')
        },
        duty_add(name){
            return http.post('/rbac/duty_add', { name })
        },
        duty_delete(dutyid){
            return http.post('/rbac/duty_delete', { dutyid })
        },
        staff_command_reload(){
            return http.post('/rbac/staff_command_reload', {})
        },
        command_delete(cmdid){
            return http.post('/rbac/command_delete', { cmdid })
        },
        command_list(pagenum, pagesize){
            return http.get('/rbac/command_list', { pagenum, pagesize })
        },
        command_add({ module, action, name }){
            return http.post('/rbac/command_add', { module, action, name })
        },

        duty_command_list(dutyid){
            return http.get('/rbac/duty_command_list', { dutyid })
        },
        command_todo_list(){
            return http.get('/rbac/command_todo_list')
        },
        command_rename({ cmdid, name }){
            return http.post('/rbac/command_rename', { cmdid, name })
        },
        duty_command_add({ dutyid, cmdid }){
            return http.post('/rbac/duty_command_add', { dutyid, cmdid })
        },
        duty_command_delete({ dutyid, cmdid }){
            return http.post('/rbac/duty_command_delete', { dutyid, cmdid })
        },
        duty_assign({ roleid, dutyid }){
            return http.post('/rbac/duty_assign', { roleid, dutyid })
        },
        role_duty_list(roleid){
            return http.get('/rbac/role_duty_list', { roleid })
        },
        role_duty_delete({ roleid, dutyid }){
            return http.post('/rbac/role_duty_delete', { roleid, dutyid })
        },
        staff_role_list(staffid){
            return http.get('/rbac/staff_role_list', { staffid })
        },
        staff_role_add({ staffid, roleid }){
            return http.post('/rbac/staff_role_add', { roleid, staffid })
        },
        staff_list(pagenum, pagesize){
            return http.get('/rbac/staff_list', { pagenum, pagesize })
        },
        staff_role_delete({ staffid, roleid }){
            return http.post('/rbac/staff_role_delete', { roleid, staffid })
        },
        menu_sort(menuid){
            return http.post('/rbac/menu_sort', { menuid })
        }
    },

}
