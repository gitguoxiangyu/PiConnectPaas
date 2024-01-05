import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // 路由懒加载，Vue Router 动态引入
    {
      path: '/login',
      name: 'login',
      component: async () => await import('@/view/LoginView.vue'),
      redirect: '/login/acocount',
      children: [
        {
          path: 'acocount',
          name: 'acocount',
          component: async () => await import('@/components/Login/AccountLogin.vue')
        },
        {
          path: 'phonenum',
          name: 'phonenum',
          component: async () => await import('@/components/Login/PhoneNumLogin.vue')
        },
        {
          path: 'regiester',
          name: 'regiester',
          component: async () => await import('@/components/Login/ReGiester.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'mainPage',
      component: async () => await import('@/view/MainPage.vue'),
      children: [
        {
          path: 'devicesmanage',
          name: 'devicesmanage',
          component: async () => await import('@/components/Devices/DevicesManage.vue')
        },
        {
          path: 'devicesmonitor',
          name: 'devicesmonitor',
          component: async () => await import('@/components/Devices/DevicesMonitor.vue')
        }
      ]
    }

  ]
})

export default router
