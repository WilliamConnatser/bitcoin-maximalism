<template>
    <div class="section dynamic-section">
        <TableOfContents :args="args" :slug="sectionSlug" />
        <ChildSlide v-for="arg in args" :arg="arg" :key="arg.slug" :fullpage="fullpage" />
    </div>
</template>

<script>
    import ChildSlide from "./ChildSlide";
    import TableOfContents from "./TableOfContents";

    export default {
        name: "ParentSlide",
        props: {
            args: Array,
            sectionSlug: String,
            fullpage: Object
        },
        components: {
            ChildSlide,
            TableOfContents
        }
    };
</script>