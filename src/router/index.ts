import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // 路由懒加载，Vue Router 动态引入
    {
      path: '/login',
      name: 'login',
      component: async () => await import('@/components/HelloWorld.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: async () => await import('@/view/MainPage.vue')
    }

  ]
})

export default router
