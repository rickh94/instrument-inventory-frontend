import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/new',
    name: 'New',
    component: () => import(/* webpackChunkName: "new" */ '../views/New.vue'),
  },
  {
    path: '/batch',
    name: 'Batch',
    component: () => import(/* webpackChunkName: "retrieve" */ '../views/Batch.vue'),
  },
  {
    path: '/sign-out',
    name: 'SignOut',
    component: () => import(/* webpackChunkName: "sign-out" */ '../views/SignOut.vue'),
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () =>
      import(/* webpackChunkName: "inventory" */ '../views/Inventory.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
