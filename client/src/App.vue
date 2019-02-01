<template>
    <div id="app">
        <Header />
        <router-view class="view" />
        <Footer />
    </div>
</template>

<script>
    import Header from "./components/layout/Header";
    import Footer from "./components/layout/Footer";

    export default {
        name: "app",
        components: {
            Header,
            Footer
        },
        created(){
            this.$toasted.global.accept_tos_privacy();
        }
    };
</script>

<style lang="scss">
    @import "./sass/base";
    @import "./sass/components";
    @import "./sass/forms";
    @import "./sass/layout";
    @import "./sass/typography";
    @import "./sass/utility";
</style>