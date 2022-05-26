<script setup lang='ts'>
import { faGithub, faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import {computed, onMounted, ref} from "vue";
import type { User, ZoneInfo } from "../lib/data";
import {getUser, redirectLogin, deleteAccount, getZones, patchUser} from "../lib/api";
// @ts-ignore
import VueSelect from "vue-multiselect"
import Page from "../components/Page.vue";

const account = ref<User | undefined>();
const zones = ref<ZoneInfo[]>([]);
const selectedZoneId = ref<string>('utc');

const toastColor = ref<"red" | "green">("green");
const toastMessage = ref<string>("");
const showToast = ref(false);
const toastClass = computed(() => ({
  toast: true,
  [toastColor.value]: true,
}));

onMounted(async () => {
  account.value = await getUser();
  console.log(account.value);
  zones.value = await getZones();
  selectedZoneId.value = account.value?.timezoneInfo.id ?? 'utc';
});

function saveAccount() {
  patchUser({ zoneId: selectedZoneId.value }).then(async () => {
    account.value = await getUser();
    toastColor.value = "green";
    toastMessage.value = "Account saved!"
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }).catch(() => {
    toastColor.value = "red";
    toastMessage.value = "Could not save account!"
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  })
}

const confirmationMessage = "delete my account";

function confirmDeleteAccount() {
  const answer = prompt(`Please type "${confirmationMessage}" below to delete your account.`);

  if (answer === confirmationMessage) deleteAccount();
}
</script>

<template>
  <Page>
    <main v-if="account" class="container mx-auto bg-white flex-grow p-4">
      <section class="settingSection">
        <h1 class="heading">Linked Accounts</h1>
        <p class="description">Below are your linked accounts, and options to link new ones. Click any to link or re-link</p>
        <div class="accounts">
          <button class='btn github' @click='redirectLogin("github")'>
            <font-awesome-icon :icon="faGithub" class="mr-2"></font-awesome-icon>
            GitHub
            <span class="linkTag">{{ account.githubId ? 'Linked' : 'Not Linked' }}</span>
          </button>
          <button class='btn discord' @click='redirectLogin("discord")'>
            <font-awesome-icon :icon="faDiscord" class="mr-2"></font-awesome-icon>
            Discord
            <span class="linkTag">{{ account.discordId ? 'Linked' : 'Not Linked' }}</span>
          </button>
          <button class='btn twitter' @click='redirectLogin("twitter")'>
            <font-awesome-icon :icon="faTwitter" class="mr-2"></font-awesome-icon>
            Twitter
            <span class="linkTag">{{ account.twitterId ? 'Linked' : 'Not Linked' }}</span>
          </button>
        </div>
      </section>

      <section class="settingSection">
        <h1 class="heading">Timezone</h1>
        <p class="description">Below you can edit your timezone</p>
        <div class="flex items-center w-full">
          <VueSelect v-model="selectedZoneId" :options="zones.map(it => it.id)" />
          <button
              class="btn green noFullMobile ml-3"
              v-if="selectedZoneId !== account.timezoneInfo.id"
              @click="saveAccount"
          >
            Save
          </button>
        </div>
      </section>

      <section class="settingSection">
        <h1 class="heading text-red-500">Delete Account</h1>
        <p class="description">Below is the option to delete your account. You will be prompted to confirm this action, because it is <b>irreversible</b>!</p>
        <button class='btn red' @click='confirmDeleteAccount'>
          Delete Account
        </button>
      </section>
    </main>
  </Page>

  <div v-if="showToast" :class="toastClass">
    {{toastMessage}}
  </div>
</template>

<style scoped lang="scss">

.accounts {
  @apply flex flex-wrap;

  .btn {
    @apply mb-3;

    &:last-of-type {
      @apply mb-0 lg:mb-3;
    }

    &:not(:last-of-type) {
      @apply lg:mr-3 inline-flex;
    }
  }
}

.toast {
  @apply bottom-2 right-2 rounded text-white px-3 py-2 absolute;

  &.red {
    @apply bg-red-500;
  }

  &.green {
    @apply bg-green-500;
  }
}

.settingSection {
  @apply flex flex-col items-center lg:items-start;

  &:not(:last-of-type) {
    @apply mb-8;
  }

  .heading {
    @apply text-3xl mb-4 font-bold;
  }

  .description {
    @apply mb-2 text-center lg:text-left;
  }
}

.btn {
  @apply rounded text-white px-3 py-2 flex items-center w-full lg:w-auto justify-center;

  :global(.svg-inline--fa) {
    @apply leading-none;
  }

  &.noFullMobile {
    @apply w-auto;
  }

  &.red {
    @apply bg-red-500;

    &:hover {
      @apply bg-red-600;
    }
  }

  &.green {
    @apply bg-green-500;

    &:hover {
      @apply bg-green-600;
    }
  }

  .linkTag {
    @apply text-xs bg-white rounded-sm ml-2 px-1;
  }

  &.github {
    background-color: #333333;

    .linkTag {
      color: #333333;
    }

    &:hover {
      background-color: darken(#333333, 10);

      .linkTag {
        color: darken(#333333, 10);
      }
    }
  }

  &.discord {
    background-color: #5865F2;

    .linkTag {
      color: #5865F2;
    }

    &:hover {
      background-color: darken(#5865F2, 10);

      .linkTag {
        color: darken(#5865F2, 10);
      }
    }
  }

  &.twitter {
    background-color: #1da1f2;

    .linkTag {
      color: #1da1f2;
    }

    &:hover {
      background-color: darken(#1da1f2, 10);

      .linkTag {
        color: darken(#1da1f2, 10);
      }
    }
  }
}
</style>
