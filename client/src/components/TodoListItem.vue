<template>
  <tr>
    <td>
      {{task.task}}
    </td>
    <td>
      <span v-if="task.completed">Completed</span>
      <span v-else>Incomplete</span>
      <br/>
      <label @change="toggleCompletion" class="switch">
        <input type="checkbox" :checked="task.completed">
        <span class="slider round"></span>
      </label>
    </td>
    <td>
      {{formatDate(task.dateCreated)}}
    </td>
  </tr>
</template>

<script>
  export default {
    name: 'TodoListItem',
    props: [
      'task'
    ],
    methods: {
      formatDate(str) {
        if (!str) {
          return 'No Date Given...';
        }
        str = new Date(str);
        return ((str.getMonth() < 9) ? '0' : '') + (str.getMonth() + 1) + '-' +
          ((str.getDate() < 10) ? '0' : '') + str.getDate() + '-' +
          str.getFullYear() + ' ' +
          str.getHours() + ':' +
          str.getMinutes();
      },
      toggleCompletion() {
        //Call Vuex action for toggling if a task has been completed
        this.$store.dispatch('toggleCompletion', this.task._id);
      }
    }
  }
</script>

<style>
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 5em;
    height: 2em;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.8em;
    width: 2em;
    left: 0.1em;
    top: 0.1em;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked+.slider {
    background-color: #c31932;
  }

  input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked+.slider:before {
    -webkit-transform: translateX(2.8em);
    -ms-transform: translateX(2.8em);
    transform: translateX(2.8em);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>