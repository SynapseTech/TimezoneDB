<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { computed, onMounted, ref } from 'vue';
import type { User } from '../lib/data';
import { getUser } from '../lib/api';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const loggedIn = computed(() => authStore.loggedIn);
const account = ref<User | undefined>();

async function logout() {
	authStore.logOut();
	await router.push('/');
}
onMounted(async () => {
	account.value = await getUser();
});
</script>

<template>
	<nav class="w-full bg-gray-800 flex-grow-0 text-white">
		<div class="container mx-auto flex items-center">
			<RouterLink class="font-bold flex-grow-0 px-3" to="/">
				TimezoneDB
			</RouterLink>

			<div class="flex-grow" />

			<div class="flex-grow-0 flex items-center">
				<template v-if="loggedIn">
					<div
						v-if="account"
						class="item noHover hidden lg:inline-block"
					>
						Logged in as {{ account.username }}
					</div>
					<RouterLink to="/account" active-class="active" class="item"
						>Account</RouterLink
					>
					<button class="item" @click="logout">Log Out</button>
				</template>
				<RouterLink v-else class="item" to="/login">Log In</RouterLink>
			</div>
		</div>
	</nav>
</template>

<style scoped lang="scss">
.item {
	@apply py-3 px-3;

	&.active {
		@apply bg-sky-400;
	}

	&:not(.noHover):not(.active):hover {
		@apply bg-gray-900;
	}
}
</style>
