<template>
  <div>
    <v-text-field 
      v-model="userSearch" 
      prepend-inner-icon="mdi-magnify"
      :append-inner-icon="userSearch ? 'mdi-close-circle' : ''" 
      placeholder="Search..." 
      class="mt-9"
      @click:append-inner="clearSearch"
    ></v-text-field>
    <div class="mb-3"></div>  
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string,
}>()

const emit = defineEmits([
  'update:modelValue',
])

const userSearch = computed({
  get: () => props.modelValue,
  set: (v) => {
    emit('update:modelValue', v)
  }
})

function clearSearch(): void {
  userSearch.value = ""
}
</script>

<!-- style="width:60vw; min-width:300px; max-width: 500px; margin-bottom: -20px" -->
