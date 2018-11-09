import Vue from 'vue'
import Router from 'vue-router'
import TodoList from './components/TodoList.vue'
import PageNotFound from './components/PageNotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  //  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'TodoList',
      component: TodoList
    },
    {
      path: "*",
      name: 'PageNotFound',
      component: PageNotFound
    }

  ]
})