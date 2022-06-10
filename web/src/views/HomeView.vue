<script setup lang="ts">
import Page from "../components/Page.vue";
import { faGithub, faTwitter, faDiscord, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { ref } from 'vue';

interface ScreenshotData {
  src: String;
  description: String;
}

const screenshots = ref<ScreenshotData[]>([
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a0ae49URyXxQ5wWXuC.png',
    description: 'Twitch chat integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a0acd8WmGASu9BFfaw.png',
    description: 'Twitch profile integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a0ae78fL2snKTMlFVS.png',
    description: 'Twitch profile card integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a0a869P1M6bqHKCaot.png',
    description: 'Discord autocomplete integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a0a85beBl7H8c21vFz.png',
    description: 'Discord profile integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a0a828XDKENwWYh7TT.png',
    description: 'Discord profile card integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a0a83cuEFOQw3irjqH.png',
    description: 'Discord message integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a09d2ahY6TzhkSIDil.png',
    description: 'Twitter profile card integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a09aeffo7sJ3ADYc12.png',
    description: 'Twitter profile integration',
  },
  {
    src: 'https://i-work-at-the.cocaine.institute/Lizzy62a3658bOrX6HJdsvWD0.png',
    description: 'Github profile integration',
  },
]);
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

    <main class="container h-auto flex-grow mx-auto p-4">
      <section>
        <h3 class="pageHeading mb-4">Supported Platforms</h3>
        <div class="grid grid-cols-4 gap-2 w-full">
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
      </section>

      <section class="mt-8">
        <h4 class="pageHeading mb-4">Screenshots</h4>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <a
            v-for="(screenshot, index) in screenshots"
            :href="screenshot.src"
            :key="index"
            class="flex flex-col items-center justify-center bg-gray-200 rounded relative"
          >
            <img :src="screenshot.src" :alt="screenshot.description" class="object-fill max-h-96" />
            <span class="absolute bottom-0 w-full text-center bg-black bg-opacity-40 text-white p-1 backdrop-blur-sm rounded-b">
              {{ screenshot.description }}
            </span>
          </a>
        </div>
      </section>
    </main>
  </Page>
</template>

<style scoped lang="scss">
@import '../styles/button.scss';

.pageHeading {
  @apply font-light text-4xl text-center;
}

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
    @apply text-2xl lg:mr-2 align-bottom;
  }

  .heading {
    @apply hidden lg:block text-2xl align-top;
  }
}
</style>
