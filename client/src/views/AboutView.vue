<template>
  <div>
    <div style="width: 30%; height: 15%">
      <v-textarea
        v-model="textArea"
        label="About"
      ></v-textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const textArea = ref("This is the about page. It's a great place to start.");
</script>
