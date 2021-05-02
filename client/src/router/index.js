import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LoginRegister from '../views/LoginRegister.vue'

import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: function(to, from, next) {
      if (store.state.userInfo == null) next({ name: 'LoginRegister' })
      else next()
    }
  },
  {
    path: '/login',
    name: 'LoginRegister',
    component: LoginRegister,
    beforeEnter: function (to, from, next) {
      if (store.state.userInfo != null) next({ name: 'Home' })
      else next()
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
