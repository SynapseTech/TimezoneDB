import type { User, ZoneInfo } from '../lib/data';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export function redirectLogin(
	provider: string = 'github',
	link: boolean = false,
) {
	const authStore = useAuthStore();
	const apiUrl = import.meta.env.VITE_API_URL;
	let endpoint = `${apiUrl}/auth/${provider}`;
	if (link) endpoint += `?intent=link&token=${authStore.token}`;
	window.location.replace(endpoint);
}

export async function getUser(
	id: string | number = '@me',
): Promise<User | undefined> {
	const authStore = useAuthStore();
	if (authStore.loggedIn) {
		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/v1/users/${id}`,
			{
				headers: {
					Authorization: `Bearer ${authStore.token}`,
					Accept: 'application/json',
				},
			},
		);
		if (res.ok) return await res.json();
	}
}

export async function patchUser(
	patch: { zoneId: string },
	id: string | number = '@me',
): Promise<void> {
	const authStore = useAuthStore();
	if (authStore.loggedIn) {
		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/v1/users/${id}`,
			{
				headers: {
					Authorization: `Bearer ${authStore.token}`,
					'Content-Type': 'application/json',
				},
				method: 'PATCH',
				body: JSON.stringify(patch),
			},
		);

		if (res.ok) return Promise.resolve();
		else return Promise.reject();
	}
}

export async function getZones(): Promise<ZoneInfo[]> {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/zones`);
	if (!res.ok) return Promise.reject();
	return await res.json();
}

export async function deleteAccount() {
	const authStore = useAuthStore();
	const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/users/@me`, {
		headers: {
			Authorization: `Bearer ${authStore.token}`,
			Accept: 'application/json',
		},
		method: 'DELETE',
	});

	if (res.ok) {
		authStore.logOut();
		await useRouter().push('/');
	}
}
