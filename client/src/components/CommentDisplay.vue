<template>
	<div>
		<v-card
			elevation="0"
			:subtitle="dateDisplay(date.toString())"
			:text="body"
			style="max-width: 72ch; white-space: pre-wrap;"
		>
		</v-card>
	</div>
</template>

<script setup lang="ts">
import { dateDisplay } from '../composables/dateDisplay';

const props = defineProps<{
	body: string,
	date: string
}>()

</script>