import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/account',
			name: 'account',
			component: () => import('../views/AccountView.vue'),
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
		},
		{
			path: '/downloads',
			name: 'downloads',
			component: () => import('../views/DownloadsView.vue'),
		},
		{
			path: '/legal/attribution',
			name: 'attribution',
			component: () => import('../views/legal/Attribution.vue'),
		},
		{
			path: '/dev/api',
			name: 'apiDocsIndex',
			component: () => import('../views/developers/ApiDocsIndexView.vue'),
		},
		{
			path: '/dev/api/users',
			name: 'apiDocsUsers',
			component: () => import('../views/developers/ApiDocsUsersView.vue'),
		},
	],
});

export default router;
