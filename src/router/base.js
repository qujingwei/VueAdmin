import vue from '../components/common/Index.vue'
import branch_form from '../components/base/branch/branch_form'
import branch_list from '../components/base/branch/branch_list'
import staff_form from '../components/base/staff/staff_form'
import staff_list from '../components/base/staff/staff_list'
import dev_command from '../components/base/dev/dev_command'
import dev_duty from '../components/base/dev/dev_duty'
import dev_menu from '../components/base/dev/dev_menu'
import dev_role from '../components/base/dev/dev_role'
import icenter_info from '../components/base/icenter/icenter_info'
import icenter_password from '../components/base/icenter/icenter_password'
import rbac_staff from '../components/base/rbac/rbac_staff'

export default [
    {
        path: '/',
        component: vue
    },
    //部门管理
    {
        path: '/branch/branch_add',
        component: branch_form
    },
    {
        path: '/branch/branch_list',
        component: branch_list
    },
    //员工管理
    {
        path: '/staff/staff_add',
        component: staff_form
    },
    {
        path: '/staff/staff_list',
        component: staff_list
    },
    //开发管理
    {
        path: '/dev/dev_command',
        component: dev_command
    },
    {
        path: '/dev/dev_duty',
        component: dev_duty
    },
    {
        path: '/dev/dev_menu',
        component: dev_menu
    },
    {
        path: '/dev/dev_role',
        component: dev_role
    },
    //个人中心
    {
        path: '/icenter/icenter_info',
        component: icenter_info
    },
    {
        path: '/icenter/icenter_password',
        component: icenter_password
    },
    //权限管理
    {
        path: '/rbac/rbac_staff',
        component: rbac_staff
    },
]
