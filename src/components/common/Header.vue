<template>
    <div class="header" style="background-color: #00a3fe;">
        <div class="logo">FireFilm后台管理系统</div>
        <div class="user-info">
            <div id="tp-weather-widget" style="float: left;margin-right:40px"></div>
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                <img class="user-logo" src="../../assets/avatar.jpg">
                {{user_info.realname}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {}
        },
        created(){
            tpwidget("init", {
                "flavor": "slim",
                "location": "WS10730EM8EV",
                "geolocation": "enabled",
                "language": "zh-chs",
                "unit": "c",
                "theme": "chameleon",
                "container": "tp-weather-widget",
                "bubble": "enabled",
                "alarmType": "badge",
                "uid": "U62E1ECEAC",
                "hash": "79d315007acd5f304e1947e288bfde78"
            });
            tpwidget("show")
        },
        computed: {
            ...mapGetters([
                'user_info'
            ])
        },
        methods: {
            handleCommand(command) {
                if (command == 'logout') {
                    this.$store.commit('logout')
                    this.$cookie.set('sessionid', '')
                    this.$router.push('/');
                }
            }
        }
    }


</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }

    .header .logo {
        float: left;
        width: 250px;
        padding-left: 16px
        /*text-align: center;*/
    }

    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }

    .user-info .el-dropdown-link {
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }

    .user-info .user-logo {
        position: absolute;
        left: 0;
        top: 15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
