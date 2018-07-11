<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router>
            <el-menu-item index="/index">
                首页
            </el-menu-item>
            <el-submenu v-for="item in menu" :index="item.menuid">
                <template slot="title">{{item.name}}</template>
                <el-menu-item v-if="item.items" v-for="subitem in item.items" :index="'/' + item.menuid + '/' + subitem.menuid">{{subitem.name}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        // mounted(){
        //     // setTimeout( () => {
        //     //     this.onRoutes = this.$route.path
        //     // },100)
        // },
        computed:{
            ...mapGetters([
                'menu'
            ]),
            onRoutes(){
                return this.$route.path;
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
