<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<template>
  <footer>
    &copy; {{ new Date().getFullYear() }}&nbsp;
    <a href="https://synapsetech.dev" class="hover:text-gray-800 hover:underline">Synapse Technologies, LLC</a>

    <a href="https://github.com/SynapseTech/TimezoneDB" class="ml-8 hover:underline hidden lg:inline">
      <font-awesome-icon :icon="faGithub" fixed-width class="mr-1 no-underline" />Project Source
    </a>
  </footer>
</template>

<style scoped lang="scss">
footer {
  @apply py-8 bg-gray-300 border-gray-400 border-t-[1px] border-opacity-10 text-gray-600 flex items-center justify-center flex-grow-0;
}
</style>