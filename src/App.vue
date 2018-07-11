<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        mounted(){
            let loading = document.querySelector('#loading')
            loading.style.opacity = 0
            loading.style.transform = 'scale(5)'

            let app = document.querySelector('#app')
            app.style.opacity = 1
            setTimeout(() => loading.remove(),500)
        }
    }
</script>
<style>
    @import "../static/css/main.css";
    /*@import "../static/css/color-dark.css";     !*深色主题*!*/
    /*@import "../static/css/theme-green/color-green.css";   !*浅绿色主题*!*/
    /*@import "../static/css/theme-green/fire.css";*/
    @import "../static/css/theme-green/blue.css";

    #app{
        opacity: 0;
        transition: all 1s;
    }
</style>
