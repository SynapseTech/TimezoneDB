<script setup lang='ts'>
import { redirectLogin } from '../lib/api';
import { faGithub, faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
</script>

<template>
  <main class='flex flex-col w-screen h-screen items-center justify-center bg-gray-200'>
    <section class='flex flex-col w-full lg:w-1/3'>
      <h1 class='w-full text-center text-6xl font-light mb-4'>TimezoneDB</h1>
      <div class='bg-white lg:rounded p-4'>
        <h2 class='w-full text-center text-2xl mb-4'>Log in or create an account</h2>
        <button class='loginOption github' @click='redirectLogin("github")'>
          <font-awesome-icon :icon="faGithub" class="mr-2"></font-awesome-icon>
          GitHub
        </button>
        <button class='loginOption discord' @click='redirectLogin("discord")'>
          <font-awesome-icon :icon="faDiscord" class="mr-2"></font-awesome-icon>
          Discord
        </button>
        <button class='loginOption twitter' @click='redirectLogin("twitter")'>
          <font-awesome-icon :icon="faTwitter" class="mr-2"></font-awesome-icon>
          Twitter
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped lang='scss'>
.loginOption {
  @apply rounded w-full text-white py-2 flex items-center justify-center;

  &:hover {
    @apply cursor-pointer;
  }

  &.github {
    background: #333333;

    &:hover {
      background-color: darken(#333333, 10);
    }
  }

  &.discord {
    background-color: #5865F2;

    &:hover {
      background-color: darken(#5865F2, 10);
    }
  }

  &.twitter {
    background-color: #1da1f2;

    &:hover {
      background-color: darken(#1da1f2, 10);
    }
  }

  &:not(:first-of-type) {
    @apply mt-3;
  }
}
</style>