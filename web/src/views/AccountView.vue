<script setup lang='ts'>
import Navbar from '../components/Navbar.vue';
import { onMounted, ref } from "vue";
import type { User } from "../lib/data";
import { getUser, redirectLogin, deleteAccount } from "../lib/api";

const account = ref<User | undefined>();

onMounted(async () => {
  account.value = await getUser();
});

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
        <h1 class="text-3xl mb-4">Linked Accounts</h1>
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
        <h1 class="text-3xl mb-4 text-red-500">Delete Account</h1>
        <p class="mb-2">Below is the option to delete your account. You will be prompted to confirm this action, because it is <b>irreversible</b>!</p>
        <button class='deleteAccountBtn' @click='confirmDeleteAccount'>
          Delete Account
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.deleteAccountBtn {
  @apply rounded text-white px-3 py-2 flex items-center bg-red-500;

  &:hover {
    @apply bg-red-600;
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
