<script setup lang="ts">
	import DocumentationPage from '../../components/DocumentationPage.vue';
	import ApiDocsSidebar from '../../components/ApiDocsSidebar.vue';
	import exampleZonesResponse from './exampleZonesResponse.json5?raw';

	// @ts-ignore
	import Prism from 'vue-prism-component';
	import 'prismjs/components/prism-json5';
	import 'prismjs/components/prism-http';

	const baseUrl = import.meta.env.VITE_API_URL;
</script>

<template>
	<DocumentationPage title="Zones Endpoint">
		<template #sidebar>
			<ApiDocsSidebar />
		</template>

		<p class="mb-4"></p>

		<section class="endpoint">
			<h2 class="heading">
				<span class="method">GET</span>
				/v1/zones
			</h2>
			<b>Example request (HTTP):</b>
			<Prism language="http" class="rounded-lg">
				GET {{ baseUrl }}/v1/zones
			</Prism>

			<b>Example Response (JSON):</b>
			<Prism language="json5" class="rounded-lg">{{
				exampleZonesResponse
			}}</Prism>
		</section>
	</DocumentationPage>
</template>

<style scoped lang="scss">
	@import '../../styles/text.scss';
	@import '../../styles/docs.scss';
</style>
