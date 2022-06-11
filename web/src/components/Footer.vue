<script setup lang='ts'>
import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<template>
  <footer>
    <span>
      &copy; {{ new Date().getFullYear() }}&nbsp;
    <a href='https://synapsetech.dev' class='hover:text-gray-800 hover:underline'>Synapse Technologies, LLC</a>
    </span>

    <div class='flex flex-wrap items-center lg:ml-8'>
      <a href='https://github.com/SynapseTech/TimezoneDB' class='footerLink'>
        <font-awesome-icon :icon='faGithub' fixed-width class='mr-1 no-underline' />Project Source
      </a>

      <router-link to='/legal/attribution' class='footerLink'>
        Attribution
      </router-link>
    </div>
  </footer>
</template>

<style scoped lang='scss'>
footer {
  @apply py-8 bg-gray-300 border-gray-400 border-t-[1px] border-opacity-10 text-gray-600 flex flex-col lg:flex-row items-center justify-center flex-grow-0 flex-wrap;
}

.footerLink {
  @apply hover:underline;

  &:not(:first-of-type) {
    @apply ml-8;
  }
}
</style>