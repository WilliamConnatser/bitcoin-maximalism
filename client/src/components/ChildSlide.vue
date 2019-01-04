<template>
  <div class="slide" :data-anchor="arg.key">
    <div class="slideWrapper">
      <h1>{{arg.title}}</h1>
      <ul>
        <li v-for="subArgument in arg.bulletPoints" :key="subArgument.key">
          {{subArgument}}
        </li>

        <li v-for="resource in arg.resources" :key="resource.link">
          <a :href="resource.link">{{resource.name}} ({{resource.type}})</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ChildSlide",
    props: {
      arg: Object
    }
  };

</script>
