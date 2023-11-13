export default {
    path: 'coupon',
    name: 'coupon',
  
    component: () => import('@/views/list/index.vue'),
    meta: {
      locale: 'menu.coupon',
      requiresAuth: true,
      icon: 'icon-gift',
    },
    children: [
      {
        path: 'coupons',
        name: 'coupons',
        component: () => import('@/views/list/coupon/index.vue'),
        meta: {
          locale: 'menu.list.couponList',
          requiresAuth: true,
          roles: ['*'],
        },
      },
    ],
  };
  