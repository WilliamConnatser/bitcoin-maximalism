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
        }
    };
</script>

<style lang="scss">
    @import "./sass/variables";
</style>