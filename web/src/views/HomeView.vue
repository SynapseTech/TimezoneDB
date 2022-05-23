<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';
import { redirectLogin } from "../lib/auth";

const authStore = useAuthStore();

const loggedIn = computed(() => authStore.loggedIn);
const token = computed(() => authStore.loggedIn ? authStore.token : '')

function login(provider: string) {
  redirectLogin(provider)
}

function logout() {
  authStore.logOut();
}
</script>

<template>
  <main>
    <b>Currently logged in?</b> {{ loggedIn ? 'Yes' : 'No' }}<br />
    <template v-if="loggedIn">Token: {{ token }}</template>
    <button v-if="loggedIn" @click="logout">Log out</button>
    <template v-else>
      <button @click="login('github')">Log in with GitHub</button>
      <button @click="login('discord')">Log in with Discord</button>
    </template>
  </main>
</template>
