export function redirectLogin(provider: string = 'github') {
    const apiUrl = import.meta.env.VITE_API_URL
    const endpoint = `${apiUrl}/auth/${provider}`;
    window.location.replace(endpoint);
}