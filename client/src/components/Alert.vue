<template>
    <div>
      <v-alert 
        :type="type"
        :title="title"
        :text="msg"
      ></v-alert>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  type: string,
  title: string,
  msg: string,
}>();

</script>