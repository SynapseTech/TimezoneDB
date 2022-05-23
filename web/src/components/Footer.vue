<script setup lang="ts">

</script>

<template>
  <footer>
    &copy; {{ new Date().getFullYear() }} Synapse Technologies, LLC
  </footer>
</template>

<style scoped lang="scss">
footer {
  @apply py-8 bg-gray-300 border-gray-400 border-t-[1px] border-opacity-10 text-gray-600 flex items-center justify-center flex-grow-0;
}
</style>