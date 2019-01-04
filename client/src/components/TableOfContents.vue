<template>
  <div class="slide">
    <div class="slideWrapper">
        <h1>{ {{slug}} }</h1>

        <ol class="help">
            <li v-for="arg in args" :key="arg.key">
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
        return `#${slug}/${arg.key}`
      }
    }
  };

</script>