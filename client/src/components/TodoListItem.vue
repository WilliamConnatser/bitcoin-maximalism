<template>
  <tr>
    <td>
      {{task.task}}
    </td>
    <td>
      <span v-if="task.completed">Completed</span>
      <span v-else>Incomplete</span>
      <br />
      <label @change="toggleCompletion" class="switch">
        <input type="checkbox" :checked="task.completed" tooltip>
        <span class="slider"></span>
      </label>
    </td>
    <td>
      {{formatDate(task.dateCreated)}}
    </td>
    <td class="outside">
      <button @click="deleteTask" title="Delete this task">X</button>
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
        //Call Vuex action to toggle if a task has been completed or not
        this.$store.dispatch('toggleCompletion', this.task._id);
      },
      deleteTask(){
        console.log(this.task)
        
        //Call Vuex action for removing the Todo from the database and store
        this.$store.dispatch('deleteTodo', this.task._id);
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
    border-radius: 34px;
  }

  /* The slider when false */
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
    border-radius: 50%;
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

  .outside {
    border:1px solid #fff;
  }

  button {
    margin: 1em;
    padding: 1em;
    border-radius: 50%;
    border-radius: 1em;
  }
</style>