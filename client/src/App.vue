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
            //Accept ToS and Privacy Policy
            this.$toasted.global.accept_tos_privacy();
            //Set Referral Cookie
            if(this.$route.query && this.$route.query.ref) {
                if(!localStorage.ref) localStorage.setItem("ref", this.$route.query.ref);
            }
        }
    };
</script>

<style lang="scss">
    @import "./sass/base";
    @import "./sass/forms";
    @import "./sass/layouts";
    @import "./sass/typography";
    @import "./sass/variables";
    @import "./sass/utilities";
</style>