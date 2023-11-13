export default {
	path: 'carousel',
	name: 'carousel',

	component: () => import('@/views/list/index.vue'),
	meta: {
		locale: 'menu.show',
		requiresAuth: true,
		icon: 'icon-expand',
	},
	children: [
		{
			path: 'index', // The midline path complies with SEO specifications
			name: 'index-carousel',
			component: () => import('@/views/list/carousel/index.vue'),
			meta: {
				locale: 'menu.list.carousel',
				requiresAuth: true,
				roles: ['*'],
			},
		}
	],
};