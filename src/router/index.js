import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: function () {
      return ({ name: 'auth-user' })
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/components/NotFound.vue'),
  },
  {
    path: '/auth',
    name: 'auth-user',
    component: () => import('@/components/Main.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/components/user/Home.vue'),
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

export default router
