
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: "/welcome",
    component: () => import('@/views/layout'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
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
  },

]

const createRouter = () =>
  new Router({
    // base: "/admin",
    // mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router