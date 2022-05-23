import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const loggedIn = ref<boolean>(false);

  function logIn(loginToken: string) {
    token.value = loginToken;
    loggedIn.value = true;
  }

  function logOut() {
    token.value = null;
    loggedIn.value = false;
  }

  return { logIn, logOut, token, loggedIn };
});
