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
			<div class="flex-grow-0 flex items-center">
				<RouterLink class="font-bold px-3" to="/">
					TimezoneDB
				</RouterLink>

				<RouterLink
					class="item lightweight hiddenMobile"
					active-class="active"
					to="/integrations"
				>
					<div class="bottomBar" />
					Integrations
				</RouterLink>
			</div>

			<div class="flex-grow" />

			<div class="flex-grow-0 flex items-center">
				<template v-if="loggedIn">
					<div v-if="account" class="item noHover hiddenMobile">
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

		&.hiddenMobile {
			@apply hidden lg:inline-block;
		}

		&.active {
			@apply bg-sky-400;
		}

		&.lightweight {
			@apply relative;

			.bottomBar {
				@apply hidden absolute bottom-0 left-2 right-2 h-[4px] rounded-t-sm;
			}

			&.active {
				.bottomBar {
					@apply bg-sky-400 block;
				}

				@apply bg-transparent;
			}
		}

		&:not(.noHover):not(.active):hover {
			@apply bg-gray-900;
		}
	}
</style>
