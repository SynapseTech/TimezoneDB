<script setup lang="ts">
	import DocumentationPage from '../../components/DocumentationPage.vue';
	import ApiDocsSidebar from '../../components/ApiDocsSidebar.vue';

	import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
</script>

<template>
	<DocumentationPage title="TimezoneDB API Documentation">
		<template #sidebar>
			<ApiDocsSidebar />
		</template>

		<p class="mb-4">
			Welcome to the public API documentation for TimezoneDB! Below are
			the recommended documentation pages for most people using the public
			API.
		</p>

		<router-link to="/dev/api/users" class="blockLink">
			<span class="flex-grow pr-4">User Endpoints</span>
			<font-awesome-icon
				:icon="faArrowRight"
				fixed-width
			></font-awesome-icon>
		</router-link>
	</DocumentationPage>
</template>

<style scoped lang="scss">
	@import '../../styles/text.scss';
	@import '../../styles/docs.scss';
</style>
