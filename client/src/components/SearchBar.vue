<template>
  <div>
    <v-text-field 
      v-model="userSearch" 
      prepend-inner-icon="mdi-magnify" 
      placeholder="Search..." 
      class="ma-3"
      style="width: 400px"></v-text-field>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string,
}>();

const emit = defineEmits([
  'update:modelValue',
]);

const userSearch = computed({
  get: () => props.modelValue,
  set: (v) => {
    emit('update:modelValue', v);
  }
});
</script>