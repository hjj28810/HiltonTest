
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/welcome')
  },
  {
    name: "guestLogin",
    path: '/guestLogin',
    component: () => import('@/views/guestLogin')
  },
  {
    name: "mainView",
    path: '/mainView',
    component: () => import('@/views/mainView')
  },
]

const router = new Router({
  routes: constantRouterMap
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router