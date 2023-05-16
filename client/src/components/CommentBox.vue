<template>
  <div>
    <v-textarea
      v-model="commentArea"
      label="New Comment"
      auto-grow
      :rules="maxCommentLength"
      counter="256"
      class="mb-2"
    ></v-textarea>
    <div class="d-flex flex-column justify-center align-center">
      <v-btn
        v-if="commentArea"
        color="primary"
      >Post</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const commentArea = ref("");
const maxCommentLength = ref([v => v.length <= 256 || 'Character Limit Reached'])

</script>