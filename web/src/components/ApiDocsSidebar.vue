<script setup lang="ts"></script>

<template>
	<!-- todo: search bar -->
	<router-link to="/dev/api" class="sidebarItem" active-class="active">
		Home
	</router-link>

	<div class="sidebarHeader">Endpoints</div>

	<router-link to="/dev/api/users" class="sidebarItem" active-class="active">
		User Endpoints
	</router-link>
</template>

<style scoped lang="scss">
	@import '../styles/docs.scss';
</style>
