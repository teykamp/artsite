<template>
  <div>
    <v-snackbar 
      v-model="showSnackbar"
      :timeout="timeout"
    >
      <v-container>
        <v-row>
          <slot name="content"></slot>
        </v-row>
        <v-row class="d-flex justify-center">
          <slot name="actions"></slot>
        </v-row>
      </v-container>

    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  showSnackbar: boolean,
  timeout: number,
}>()

const emits = defineEmits([
  "update:showSnackbar",
])

const showSnackbar = computed({
  get: () => props.showSnackbar,
  set: (value) => emits("update:showSnackbar", value)
})
</script>
