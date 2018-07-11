<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import { mapGetters } from 'vuex'

    export default {
        data(){
            return {

            }
        },
        components:{
            vHead, vSidebar
        },
        created(){
            this.$api.icenter.info().then( res => {
                this.$store.commit('user_info',res)
            }).catch( err => {
                this.$error(err.errinfo)
            })

            this.$store.dispatch('menu')

            let heartbeat = setInterval( () => {
                this.$api.common.heartbeat( this.user_info.username ).then( res => {

                }).catch( err => {
                    clearInterval(heartbeat)
                    this.$store.commit('logout')
                    this.$cookie.set('sessionid','')
                    this.$router.push('/')
                })
            },30000)
        },
        computed: {
            ...mapGetters([
                'user_info'
            ])
        }
    }
</script>
