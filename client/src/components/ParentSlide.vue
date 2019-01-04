<template>
    <div class="section">
        <TableOfContents :args="args" :slug="sectionSlug" />
        <ChildSlide v-for="arg in args" :arg="arg" :key="arg.key"></ChildSlide>
    </div>
</template>

<script>
import ChildSlide from "./ChildSlide";
import TableOfContents from "./TableOfContents";

export default {
    name: "ParentSlide",
    props: {
        args: Array,
        sectionSlug: String
    },
    components: {
        ChildSlide,
        TableOfContents
    }
};
</script>