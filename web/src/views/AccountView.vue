<script setup lang="ts">
import {
	faGithub,
	faDiscord,
	faTwitter,
	faTwitch,
} from '@fortawesome/free-brands-svg-icons';
import { computed, onMounted, ref } from 'vue';
import type { User, ZoneInfo } from '../lib/data';
import {
	getUser,
	redirectLogin,
	deleteAccount,
	getZones,
	patchUser,
} from '../lib/api';
// @ts-ignore
import VueSelect from 'vue-multiselect';
import Page from '../components/Page.vue';

const account = ref<User | undefined>();
const zones = ref<ZoneInfo[]>([]);
const selectedZoneId = ref<string>('utc');

const toastColor = ref<'red' | 'green'>('green');
const toastMessage = ref<string>('');
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
	patchUser({ zoneId: selectedZoneId.value })
		.then(async () => {
			account.value = await getUser();
			toastColor.value = 'green';
			toastMessage.value = 'Account saved!';
			showToast.value = true;
			setTimeout(() => {
				showToast.value = false;
			}, 3000);
		})
		.catch(() => {
			toastColor.value = 'red';
			toastMessage.value = 'Could not save account!';
			showToast.value = true;
			setTimeout(() => {
				showToast.value = false;
			}, 3000);
		});
}

const confirmationMessage = 'delete my account';

function confirmDeleteAccount() {
	const answer = prompt(
		`Please type "${confirmationMessage}" below to delete your account.`,
	);

	if (answer === confirmationMessage) deleteAccount();
}
</script>

<template>
	<Page>
		<main v-if="account" class="container mx-auto bg-white flex-grow p-4">
			<section class="settingSection">
				<h1 class="heading">Linked Accounts</h1>
				<p class="description">
					Below are your linked accounts, and options to link new
					ones. Click any to link or re-link
				</p>
				<div class="accounts">
					<button
						class="btn github"
						@click="redirectLogin('github', true)"
					>
						<font-awesome-icon
							:icon="faGithub"
							class="mr-2"
						></font-awesome-icon>
						GitHub
						<span class="linkTag">{{
							account.githubId ? 'Linked' : 'Not Linked'
						}}</span>
					</button>
					<button
						class="btn discord"
						@click="redirectLogin('discord', true)"
					>
						<font-awesome-icon
							:icon="faDiscord"
							class="mr-2"
						></font-awesome-icon>
						Discord
						<span class="linkTag">{{
							account.discordId ? 'Linked' : 'Not Linked'
						}}</span>
					</button>
					<button
						class="btn twitter"
						@click="redirectLogin('twitter', true)"
					>
						<font-awesome-icon
							:icon="faTwitter"
							class="mr-2"
						></font-awesome-icon>
						Twitter
						<span class="linkTag">{{
							account.twitterId ? 'Linked' : 'Not Linked'
						}}</span>
					</button>
					<button
						class="btn twitch"
						@click="redirectLogin('twitch', true)"
					>
						<font-awesome-icon
							:icon="faTwitch"
							class="mr-2"
						></font-awesome-icon>
						Twitch
						<span class="linkTag">{{
							account.twitchId ? 'Linked' : 'Not Linked'
						}}</span>
					</button>
				</div>
			</section>

			<section class="settingSection">
				<h1 class="heading">Timezone</h1>
				<p class="description">Below you can edit your timezone</p>
				<div class="flex items-center w-full">
					<VueSelect
						v-model="selectedZoneId"
						:options="zones.map((it) => it.id)"
					/>
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
				<p class="description">
					Below is the option to delete your account. You will be
					prompted to confirm this action, because it is
					<b>irreversible</b>!
				</p>
				<button class="btn red" @click="confirmDeleteAccount">
					Delete Account
				</button>
			</section>
		</main>
	</Page>

	<div v-if="showToast" :class="toastClass">
		{{ toastMessage }}
	</div>
</template>

<style scoped lang="scss">
@import '../styles/button.scss';

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
</style>
