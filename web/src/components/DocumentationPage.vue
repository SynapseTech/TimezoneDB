<script setup lang="ts">
	import Page from './Page.vue';

	export interface DocumentationPageProps {
		title?: string;
	}

	const props = withDefaults(defineProps<DocumentationPageProps>(), {});
</script>

<template>
	<Page nobg>
		<main class="flex flex-grow relative">
			<aside
				class="self-stretch w-72 bg-white border-r-[1px] border-gray-300 p-2"
			>
				<div class="flex flex-col sticky top-0">
					<slot name="sidebar" />
				</div>
			</aside>

			<article class="flex-grow">
				<div
					class="container break-words overflow-y-auto px-16 pb-4 pt-8 h-full bg-gray-200"
				>
					<h1 class="docPageHeading" v-if="props.title">
						{{ props.title }}
					</h1>
					<slot />
				</div>
			</article>
		</main>
	</Page>
</template>

<style scoped lang="scss">
	@import '../styles/text.scss';
	@import '../styles/docs.scss';
</style>
