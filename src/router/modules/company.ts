export default {
    path: 'company',
    name: 'company',
  
    component: () => import('@/views/list/index.vue'),
    meta: {
      locale: 'menu.company',
      requiresAuth: true,
      icon: 'icon-apps',
    },
    children: [
      {
        path: 'search-table', // The midline path complies with SEO specifications
        name: 'searchTable',
        component: () => import('@/views/list/search-table/index.vue'),
        meta: {
          locale: 'menu.list.company',
          requiresAuth: true,
          roles: ['*'],
        },
      },
  
      {
        path: 'search-info/:authId', // The midline path complies with SEO specifications
        name: 'searchInfo',
        component: () => import('@/views/list/search-table/info/index.vue'),
        meta: {
          locale: 'menu.list.searchTable',
          requiresAuth: true,
          roles: ['*'],
          hideInMenu: true
        },
      },
  

      // {
      //   path: 'order',
      //   name: 'order',
      //   component: () => import('@/views/list/order/index.vue'),
      //   meta: {
      //     locale: 'menu.list.orderList',
      //     requiresAuth: true,
      //     roles: ['*'],
      //   },
      // },
      // {
      //   path: 'coupon',
      //   name: 'coupon',
      //   component: () => import('@/views/list/coupon/index.vue'),
      //   meta: {
      //     locale: 'menu.list.couponList',
      //     requiresAuth: true,
      //     roles: ['*'],
      //   },
      // },
  
    ],
  };
  