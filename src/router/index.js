import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      redirect:'/order'
    },
    {
      path: '/order',
      component:  resolve => require(['../components/page/order'],resolve)
    }
  ]
})
