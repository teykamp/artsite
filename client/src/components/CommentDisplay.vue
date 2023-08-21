<template>
<div>
  <v-card
    :subtitle="date"
    :text="body"
    elevation="0"
    style="{
      'max-width': '72ch',
      'white-space': 'pre-wrap'
    }"
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

const { date } = dateDisplay(props.date)
</script>