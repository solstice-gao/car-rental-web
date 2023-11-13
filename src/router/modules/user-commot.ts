export default {
  path: '/user-commit',
  name: 'userInfo',
  component: () => import('@/views/list/search-table/info/index.vue'),
  meta: {
    title: '',
    requiresAuth: false,
  },
};
