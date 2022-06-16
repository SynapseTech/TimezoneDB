<template>
	<div class="body">
		<main>
			<h1 class="pageHeader">TimezoneDB Extension Settings</h1>

			<section class="settingSection">
				<label for="apiUrlInput">API Base URL:</label>
				<input id="apiUrlInput" type="text" v-model="apiUrl" />
			</section>

			<div class="btns">
				<button class="btn green" @click="save">Save Settings</button>
				<button class="btn red" @click="clear">Clear Settings</button>
			</div>
		</main>

		<footer>
			&copy; {{ new Date().getFullYear() }} Synapse Technologies, LLC
			<a
				href="https://tzdb.synapsetech.dev/legal/attribution"
				target="_blank"
				>Attribution</a
			>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ExtensionSettings } from '~/types/settings';

const apiUrl = ref<string>();

onMounted(async () => {
	let extensionSettings: ExtensionSettings = (
		await browser.storage.sync.get({
			settings: {
				apiUrl: 'https://tzdbapi.synapsetech.dev',
			},
		})
	).settings as ExtensionSettings;
	apiUrl.value = extensionSettings.apiUrl;
});

async function save() {
	let extensionSettings: ExtensionSettings = (await browser.storage.sync.get(
		'settings',
	)) as ExtensionSettings;
	extensionSettings.apiUrl = apiUrl.value;
	await browser.storage.sync.set({ settings: extensionSettings });
}

async function clear() {
	await browser.storage.sync.remove('settings');
	window.location.reload();
}
</script>

<style lang="scss">
body {
	@apply bg-gray-200 h-screen;
}

footer {
	@apply bg-gray-300 border-gray-400 border-t-[1px] border-opacity-10 text-gray-600 flex items-center justify-center flex-grow-0 py-2;

	a {
		@apply hover:underline ml-8;
	}
}

main {
	@apply flex flex-col flex-grow p-4;
}
.body {
	@apply flex flex-col container mx-auto bg-white h-full;
}

.btns {
	@apply mt-2 flex items-center;

	.btn:last-of-type {
		@apply ml-2;
	}
}

.pageHeader {
	@apply text-3xl mb-4 font-bold;
}

#app {
	@apply h-full;
}

.settingSection {
	@apply flex items-center w-full;

	&:not(:first-child) {
		@apply mt-2;
	}

	label {
		@apply mr-2 flex-grow-0 font-bold;
	}

	input {
		@apply border-gray-400 border-[1px] border-solid rounded flex-grow outline-0 px-3 py-2;
	}
}

.btn {
	@apply rounded px-3 py-2 flex items-center lg:w-auto justify-center outline-0 border-0 bg-gray-300;

	&.red {
		@apply bg-red-500 text-white;

		&:hover {
			@apply bg-red-600;
		}
	}

	&.green {
		@apply bg-green-500 text-white;

		&:hover {
			@apply bg-green-600;
		}
	}
}
</style>
