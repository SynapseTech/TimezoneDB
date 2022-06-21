<script setup lang="ts">
	import Page from '../components/Page.vue';
	import {
		faChrome,
		faFirefox,
		faEdge,
		faDiscord,
	} from '@fortawesome/free-brands-svg-icons';
</script>

<template>
	<Page>
		<div class="container bg-white flex-grow p-4 mx-auto text-center">
			<h1 class="pageHeading">Browser Downloads</h1>
			<section class="downloadsSection">
				<a
					href="https://chrome.google.com/webstore/detail/timezonedb/pnaipdklkdgobgkhkkimnbdfhenkcfga"
					class="downloadLink"
				>
					<div class="platformIcon">
						<font-awesome-icon
							:icon="faChrome"
							fixed-width
						></font-awesome-icon>
					</div>
					<div class="text">
						<span class="name">Chrome</span>
					</div>
				</a>
				<a class="downloadLink disabled" aria-disabled="true">
					<div class="platformIcon">
						<font-awesome-icon
							:icon="faFirefox"
							fixed-width
						></font-awesome-icon>
					</div>
					<div class="text">
						<span class="name">Firefox</span>
						(Coming Soon)
					</div>
				</a>
				<a class="downloadLink disabled" aria-disabled="true">
					<div class="platformIcon">
						<font-awesome-icon
							:icon="faEdge"
							fixed-width
						></font-awesome-icon>
					</div>
					<div class="text">
						<span class="name">Edge</span>
						(Coming Soon)
					</div>
				</a>
			</section>

			<h1 class="pageHeading">Other & Community Downloads</h1>
			<section class="downloadsSection">
				<a
					class="downloadLink discord"
					download="timezonedb-powercord.zip"
					href="https://downloads.synapsetech.workers.dev/tzdb-powercord-v0.1.0-release.zip"
				>
					<div class="platformIcon">
						<font-awesome-icon
							:icon="faDiscord"
							fixed-width
						></font-awesome-icon>
					</div>
					<div class="text">
						<span class="name">Download for Powercord</span>
					</div>
				</a>
			</section>
		</div>
	</Page>
</template>

<style scoped lang="scss">
	@import '../styles/text.scss';
	@import '../styles/colors.scss';

	.downloadsSection {
		@apply grid grid-cols-1 lg:grid-cols-3 auto-cols-fr w-full gap-2 my-4;

		.downloadLink {
			@apply cursor-pointer bg-gray-200 rounded flex items-center;

			&:hover:not(.disabled) {
				@apply bg-gray-300;
			}

			&.disabled {
				@apply cursor-default;
			}

			.platformIcon {
				@apply text-4xl flex justify-center items-center p-2;
			}

			.text {
				@apply flex flex-col justify-center items-start p-2 pl-0;

				.name {
					@apply font-semibold text-lg;
				}
			}

			&.discord {
				background-color: $discord;
				color: #fff;

				&:hover:not(.disabled) {
					background-color: darken($discord, 10);
				}
			}
		}
	}
</style>
