export function redirectLogin(provider: string = 'github') {
    // @ts-ignore
    const apiUrl = process.env.VUE_APP_API_URL

    const endpoint = `${apiUrl}/auth/${provider}`;
    window.location.replace(endpoint);
}