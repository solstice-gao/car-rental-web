export default {
  path: 'form',
  name: 'form',
  component: () => import('@/views/form/index.vue'),
  meta: {
    locale: 'menu.form',
    icon: 'icon-settings',
    requiresAuth: true,
  },
  children: [
    {
      path: 'step',
      name: 'step',
      component: () => import('@/views/form/step/index.vue'),
      meta: {
        locale: 'menu.form.step',
        requiresAuth: false,
        hideInMenu: true,
        roles: ['*'],
      },
    },
	{
	  path: 'add-carousel',
	  name: 'add-carousel',
	  component: () => import('@/views/form/add-carousel/index.vue'),
	  meta: {
		locale: 'menu.form.addcarousel',
		requiresAuth: false,
		hideInMenu: true,
		roles: ['*'],
	  },
	},
    {
      path: 'group',
      name: 'group',
      component: () => import('@/views/form/group/index.vue'),
      meta: {
        locale: 'menu.form.group',
        requiresAuth: false,
        roles: ['*'],
        hideInMenu: true
      },
    },
  ],
};
