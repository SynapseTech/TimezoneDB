<script setup lang='ts'>
import Navbar from '../components/Navbar.vue';
import {computed, onMounted, ref} from "vue";
import type { User, ZoneInfo } from "../lib/data";
import {getUser, redirectLogin, deleteAccount, getZones, patchUser} from "../lib/api";
// @ts-ignore
import VueSelect from "vue-multiselect";

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
  <div class="bg-gray-200 h-screen flex flex-col">
    <Navbar />

    <main v-if="account" class="container mx-auto bg-white flex-grow p-4">
      <section class="mb-8">
        <h1 class="text-3xl mb-4 font-bold">Linked Accounts</h1>
        <p class="mb-2">Below are your linked accounts, and options to link new ones. Click any to link or re-link</p>
        <button class='account github' @click='redirectLogin("github")'>
          GitHub
          <span class="linkTag">{{ account.githubId ? 'Linked' : 'Not Linked' }}</span>
        </button>
        <button class='account discord' @click='redirectLogin("discord")'>
          Discord
          <span class="linkTag">{{ account.discordId ? 'Linked' : 'Not Linked' }}</span>
        </button>
      </section>

      <section class="mb-8">
        <h1 class="text-3xl mb-4 font-bold">Timezone</h1>
        <p class="mb-2">Below you can edit your timezone</p>
        <div class="flex items-center">
          <VueSelect v-model="selectedZoneId" :options="zones.map(it => it.id)" />
          <button
              class="btn green ml-3"
              v-if="selectedZoneId !== account.timezoneInfo.id"
              @click="saveAccount"
          >
            Save
          </button>
        </div>
      </section>

      <section class="mb-8">
        <h1 class="text-3xl mb-4 text-red-500 font-bold">Delete Account</h1>
        <p class="mb-2">Below is the option to delete your account. You will be prompted to confirm this action, because it is <b>irreversible</b>!</p>
        <button class='btn red' @click='confirmDeleteAccount'>
          Delete Account
        </button>
      </section>
    </main>

    <div v-if="showToast" :class="toastClass">
      {{toastMessage}}
    </div>
  </div>
</template>

<style scoped lang="scss">
.toast {
  @apply bottom-2 right-2 rounded text-white px-3 py-2 absolute;

  &.red {
    @apply bg-red-500;
  }

  &.green {
    @apply bg-green-500;
  }
}

.btn {
  @apply rounded text-white px-3 py-2 flex items-center;

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
}

.account {
  @apply rounded text-white px-3 py-2 flex items-center;

  &:hover {
    @apply cursor-pointer;
  }

  .linkTag {
    @apply text-xs bg-white rounded-sm ml-1 px-1;
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

  &:not(:first-of-type) {
    @apply mt-3;
  }
}
</style>
