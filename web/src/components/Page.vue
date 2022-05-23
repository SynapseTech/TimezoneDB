<script setup lang="ts">
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
</script>

<template>
  <div class="page">
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
}

.content {
  @apply flex-grow flex flex-col;

  ::v-deep(*) {
    @apply h-full
  }
}
</style>