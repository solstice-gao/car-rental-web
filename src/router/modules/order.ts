export default {
    path: 'order',
    name: 'order',
  
    component: () => import('@/views/list/index.vue'),
    meta: {
      locale: 'menu.order',
      requiresAuth: true,
      icon: 'icon-ordered-list',
    },
    children: [
       {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/list/order/index.vue'),
        meta: {
          locale: 'menu.list.orderList',
          requiresAuth: true,
          roles: ['*'],
        },
      },
  
    ],
  };
  