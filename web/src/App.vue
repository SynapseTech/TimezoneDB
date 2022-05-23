<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);

  if (params.has('token')) {
    authStore.logIn(params.get('token')!!);
    await router.push('/account');
  }

  if (authStore.loggedIn && router.currentRoute.value.name === 'home')
    await router.push('/account');
});
</script>

<template>
  <RouterView />
</template>

<style>
</style>
