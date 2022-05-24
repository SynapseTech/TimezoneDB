<script setup lang="ts">
import { storageDemo } from '~/logic/storage'
</script>

<template>
  <main class="bg-gray-200 p-4">
    <h1>Options</h1>
    <input v-model="storageDemo" class="border border-gray-400 rounded px-2 py-1 mt-2">
  </main>
</template>
