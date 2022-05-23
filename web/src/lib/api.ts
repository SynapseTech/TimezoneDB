import type { User } from '../lib/data';
import { useAuthStore } from '../stores/auth';
import {useRouter} from "vue-router";

export function redirectLogin(provider: string = 'github') {
    const apiUrl = import.meta.env.VITE_API_URL
    const endpoint = `${apiUrl}/auth/${provider}`;
    window.location.replace(endpoint);
}

export async function getUser(id: string | number = '@me'): Promise<User | undefined> {
    const authStore = useAuthStore();
    if (authStore.loggedIn) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${authStore.token}`,
                'Accept': 'application/json',
            },
        });
        if (res.ok) return await res.json() as User;
    }
}

export async function deleteAccount() {
    const authStore = useAuthStore();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/users/@me`, {
        headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Accept': 'application/json',
        },
        method: 'DELETE',
    });

    if (res.ok) {
        authStore.logOut();
        await useRouter().push('/');
    }
}