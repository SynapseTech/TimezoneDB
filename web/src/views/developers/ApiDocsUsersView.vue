<script setup lang="ts">
	import DocumentationPage from '../../components/DocumentationPage.vue';
	import ApiDocsSidebar from '../../components/ApiDocsSidebar.vue';
	import exampleUserResponse from './exampleUserResponse.json?raw';

	// @ts-ignore
	import Prism from 'vue-prism-component';
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-http';

	const baseUrl = import.meta.env.VITE_API_URL;
</script>

<template>
	<DocumentationPage title="User Endpoints">
		<template #sidebar>
			<ApiDocsSidebar />
		</template>

		<p class="mb-4">
			Updating a user requires that user being currently authenticated via
			JWT, however, for the time being, that functionality will not be
			documented as it serves no good purpose for integrators of the API.
		</p>

		<section class="endpoint">
			<h2 class="heading">
				<span class="method">GET</span>
				/v1/users/:id
			</h2>
			<b>Example request (HTTP):</b>
			<Prism language="http" class="rounded-lg">
				GET {{ baseUrl }}/v1/users/853034340056039424
			</Prism>

			<b>Example Response (JSON):</b>
			<Prism language="json" class="rounded-lg">{{
				exampleUserResponse
			}}</Prism>
		</section>

		<section class="endpoint">
			<h2 class="heading">
				<span class="method">GET</span>
				/v1/users/byPlatform/discord/:discordId
			</h2>
			<b>Example request (HTTP):</b>
			<Prism language="http" class="rounded-lg">
				GET {{ baseUrl }}/v1/users/byPlatform/discord/543542278967394322
			</Prism>

			<b>Example Response (JSON):</b>
			<Prism language="json" class="rounded-lg">{{
				exampleUserResponse
			}}</Prism>
		</section>

		<section class="endpoint">
			<h2 class="heading">
				<span class="method">GET</span>
				/v1/users/byPlatform/github/:githubId
			</h2>
			<b>Example request (HTTP):</b>
			<Prism language="http" class="rounded-lg">
				GET {{ baseUrl }}/v1/users/byPlatform/github/45880278
			</Prism>

			<b>Example Response (JSON):</b>
			<Prism language="json" class="rounded-lg">{{
				exampleUserResponse
			}}</Prism>
		</section>

		<section class="endpoint">
			<h2 class="heading">
				<span class="method">GET</span>
				/v1/users/byPlatform/twitter/:twitterId
			</h2>
			<b>Example request (HTTP):</b>
			<Prism language="http" class="rounded-lg">
				GET {{ baseUrl }}/v1/users/byPlatform/twitter/909192497846505479
			</Prism>

			<b>Example Response (JSON):</b>
			<Prism language="json" class="rounded-lg">{{
				exampleUserResponse
			}}</Prism>
		</section>

		<section class="endpoint">
			<h2 class="heading">
				<span class="method">GET</span>
				/v1/users/byPlatform/twitch/:twitchId
			</h2>
			<b>Example request (HTTP):</b>
			<Prism language="http" class="rounded-lg">
				GET {{ baseUrl }}/v1/users/byPlatform/twitch/419950810
			</Prism>

			<b>Example Response (JSON):</b>
			<Prism language="json" class="rounded-lg">{{
				exampleUserResponse
			}}</Prism>
		</section>
	</DocumentationPage>
</template>

<style scoped lang="scss">
	@import '../../styles/text.scss';
	@import '../../styles/docs.scss';
</style>
