export default {
  path: 'list',
  name: 'list',

  component: () => import('@/views/list/index.vue'),
  meta: {
    locale: 'menu.car',
    requiresAuth: true,
    icon: 'icon-bar-chart',
  },
  children: [

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

    {
      path: 'card',
      name: 'card',
      component: () => import('@/views/list/card/index.vue'),
      meta: {
        locale: 'menu.list.cardList',
        requiresAuth: true,
        roles: ['*'],
      },
    }

  ],
};
