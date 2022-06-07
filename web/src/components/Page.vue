<script setup lang="ts">
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { defineProps, withDefaults, reactive, computed } from 'vue';

interface PageProps {
  nobg?: boolean
}

const props = withDefaults(defineProps<PageProps>(), { nobg: false })
const { nobg } = reactive(props);

const pageClass = computed(() => ({
  nobg,
}))
</script>

<template>
  <div class="page" :class="pageClass">
    <Navbar />
    <div class="content">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.page {
  @apply min-h-screen flex flex-col bg-gray-200;

  &.nobg {
    @apply bg-transparent;
  }
}

.content {
  @apply flex-grow flex flex-col;
}
</style>