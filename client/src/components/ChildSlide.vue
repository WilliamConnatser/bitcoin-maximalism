<template>
  <div class="slide" :data-anchor="arg.slug">
    <div class="slideWrapper">
      <h1>{{arg.title}}</h1>
      <ul>
        <li v-for="subArgument in arg.bulletPoints" :key="subArgument.content">
          {{subArgument.content}}
        </li>

        <li v-for="resource in arg.resources" :key="resource.link">
          <a :href="resource.link">{{resource.title}} ({{resource.media}})</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ChildSlide",
    props: {
      arg: Object,
      sectionSlug: String,
      fullpage: Object
    },
    mounted() {
      this.$parent.$emit('slideMounted');
    }
  };
</script>