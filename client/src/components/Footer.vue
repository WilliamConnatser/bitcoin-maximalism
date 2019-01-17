<template>
    <ul id="footer">
        <li>&copy; YOLO International LLC</li>
        <li><a href="terms">Terms</a></li>
        <li><a href="privacy">Privacy</a></li>
    </ul>
</template>

<script>
    //Import Apollo Client
    import {
        defaultClient as apolloClient
    } from '../main';

    export default {
        name: "Footer"
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables";

    ul {
        position: absolute;
        height: 3vh;
        bottom: 0;
        width: 100%;
        list-style-type: none;
        margin: 0;
        padding: 0;
        background-color: $color-primary;
        text-align: right;
    }

    li {
        display: inline-block;
        padding: 0rem 1rem;
    }

    a {
        color: $color-white;
        font-size: 1rem;
        text-decoration: none;
    }
</style>