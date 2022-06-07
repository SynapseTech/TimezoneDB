<script setup lang='ts'>
import { redirectLogin } from '../lib/api';
import { faGithub, faDiscord, faTwitter, faTwitch } from '@fortawesome/free-brands-svg-icons';
</script>

<template>
  <main class='flex flex-col w-screen h-screen items-center justify-center bg-gray-200'>
    <section class='flex flex-col w-full lg:w-1/3'>
      <h1 class='w-full text-center text-6xl font-light mb-4'>TimezoneDB</h1>
      <div class='bg-white lg:rounded p-4'>
        <h2 class='w-full text-center text-2xl mb-4'>Log in or create an account</h2>
        <button class='btn loginOption github' @click='redirectLogin("github")'>
          <font-awesome-icon :icon="faGithub" class="mr-2"></font-awesome-icon>
          GitHub
        </button>
        <button class='btn loginOption discord' @click='redirectLogin("discord")'>
          <font-awesome-icon :icon="faDiscord" class="mr-2"></font-awesome-icon>
          Discord
        </button>
        <button class='btn loginOption twitter' @click='redirectLogin("twitter")'>
          <font-awesome-icon :icon="faTwitter" class="mr-2"></font-awesome-icon>
          Twitter
        </button>
        <button class='btn loginOption twitch' @click='redirectLogin("twitch")'>
          <font-awesome-icon :icon="faTwitch" class="mr-2"></font-awesome-icon>
          Twitch
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped lang='scss'>
@import '../styles/button.scss';

.loginOption {
  @apply lg:w-full;
  &:not(:first-of-type) {
    @apply mt-3;
  }
}
</style>