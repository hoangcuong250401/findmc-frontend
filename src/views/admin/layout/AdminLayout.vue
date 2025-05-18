<template>
	<div>
		<Header />
		<main>
			<router-view />
		</main>
		<Footer />
	</div>
</template>

<script setup lang="ts">
import Header from "@/views/admin/layout/Header.vue";
import Footer from "@/views/admin/layout/Footer.vue";
</script>
