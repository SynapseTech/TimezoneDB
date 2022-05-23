<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.has('token')) {
    authStore.logIn(params.get('token')!!);
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
</style>
