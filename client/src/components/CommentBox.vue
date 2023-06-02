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
        @click="handleCommentPost"
      >Post</v-btn>
    </div>


    <!-- <Snackbar 
      v-model="showSnackbar"
      :timeout="4000"
    >Comment added successfully!</Snackbar> -->

    <!-- NOT SURE WHY ABOVE DOESNT WORK -->



  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import Snackbar from './Snackbar.vue'

const props = defineProps<{
  addComment: (comment: string) => void,
}>()

const commentArea = ref("")
const maxCommentLength = ref([v => v.length <= 256 || 'Character Limit Reached'])

function handleCommentPost() {
  props.addComment({
    body: commentArea.value, 
    date: new Date() ,
  })
  commentArea.value = ""
}
</script>