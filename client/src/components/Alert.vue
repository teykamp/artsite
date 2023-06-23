<template>
  <div>
    <v-alert 
      :type="type"
      :title="title"
      :text="msg"
      style="max-width: 50vh; min-width: 400px;"
    ></v-alert>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  type: string,
  title: string,
  msg: string,
}>()

</script>