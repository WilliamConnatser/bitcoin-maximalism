<template>
  <div class="slide active">
    <div class="slideWrapper">
        <h1>{ {{slug}} }</h1>

        <ol>
            <li v-for="arg in args" :key="arg.slug">
                <a :href="urlGenerator(slug, arg)">{{arg.title}}</a>
            </li>
        </ol>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      args: Array,
      slug: String
    },
    methods: {
      urlGenerator: (slug, arg) => {
        return `#${slug}/${arg.slug}`
      }
    }
  };

</script>