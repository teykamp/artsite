<template>
<div>
  <v-snackbar
    :timeout="timeout"
    color="success"
  >
    <slot>success</slot>
  </v-snackbar>
</div>
</template>

<script setup lang="ts">
import {ref} from 

const props = defineProps<{
  timeout: number,
}>()


</script>