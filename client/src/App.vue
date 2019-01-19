<template>
    <div id="app">
        <Header />
        <router-view class="view" />
        <Footer />
    </div>
</template>

<script>
    import Header from "./components/Header";
    import Footer from "./components/Footer";

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

    *,
    *::after,
    *::before {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
    }

    body,
    html {
        //This defines what 1REM is
        font-size: 62.5%;
        font-family: "Lato", sans-serif;
        font-weight: 300;
        line-height: 1.7;
        text-align: center;

        height: 100%;
        box-sizing: border-box;
    }

    #app {
        color: $color-white;
        background-color: $color-green;
    }

    .view {
        min-height: $view-minimum-height;
        padding: $view-padding-vertical $view-padding-horizontal;        
        font-size: 1.5rem;
    }
</style>