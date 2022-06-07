<script setup lang="ts">
import Page from "../components/Page.vue";
import { faGithub, faTwitter, faDiscord, faReddit, faTwitch } from "@fortawesome/free-brands-svg-icons";
</script>

<template>
  <Page nobg>
    <header class="min-h-[35vh] h-[35vh] w-full bg-gray-200 border-gray-300 border-b-[1px] border-opacity-10">
      <div class="container mx-auto h-full flex flex-col items-center justify-center p-4">
        <h1 class="font-light text-5xl text-center">TimezoneDB</h1>
        <h2 class='mt-2 text-gray-600 text-xl text-center'>An easy, cross-platform method of keeping track of other people's timezones.</h2>

        <div class="flex items-center flex-wrap justify-center">
          <a class="btn sky noFullMobile mt-2" href="">Add to Chrome</a> <!-- todo: chrome web store link -->
          <a class="btn sky noFullMobile mt-2 ml-2" href="">Add to Firefox</a> <!-- todo: firefox link -->
          <a class="btn sky noFullMobile mt-2 ml-2" href="">Add to Edge</a> <!-- todo: edge link -->
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <h3 class="font-light text-4xl text-center">Supported Platforms</h3>
      <div class="grid grid-cols-4 gap-2 w-full mt-2">
        <div class="platformCard github">
          <font-awesome-icon :icon="faGithub" fixed-width class="icon" />
          <h4 class="heading">GitHub</h4>
        </div>
        <div class="platformCard discord">
          <font-awesome-icon :icon="faDiscord" fixed-width class="icon" />
          <h4 class="heading">Discord</h4>
        </div>
        <div class="platformCard twitter">
          <font-awesome-icon :icon="faTwitter" fixed-width class="icon" />
          <h4 class="heading">Twitter</h4>
        </div>
<!--        <div class="platformCard reddit">-->
<!--          <font-awesome-icon :icon="faReddit" fixed-width class="icon" />-->
<!--          <h4 class="heading">Reddit</h4>-->
<!--        </div>-->
        <div class="platformCard twitch">
          <font-awesome-icon :icon="faTwitch" fixed-width class="icon" />
          <h4 class="heading">Twitch</h4>
        </div>
      </div>
    </main>
  </Page>
</template>

<style scoped lang="scss">
@import '../styles/button.scss';

.platformCard {
  @apply rounded-lg flex items-center justify-center text-white p-2;

  &.github {
    background-color: $github;
  }

  &.discord {
    background-color: $discord;
  }

  &.twitter {
    background-color: $twitter;
  }

  &.reddit {
    background-color: $reddit;
  }

  &.twitch {
    background-color: $twitch;
  }

  .icon {
    @apply text-2xl mr-2 align-bottom;
  }

  .heading {
    @apply hidden lg:block text-2xl align-top;
  }
}
</style>
