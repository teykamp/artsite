<template>
  <div>
    <v-textarea
      v-model="commentArea"
      label="New Comment"
      auto-grow
      :rules="maxCommentLength"
      counter="256"
      class="mb-2 mx-8"
    ></v-textarea>
    <div class="d-flex flex-column justify-center align-center">
      <v-btn
        :disabled="(commentArea && commentArea.length <= maxLengthCharacters) ? false : true"
        color="primary"
        @click="handleCommentPost"
      >Post</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '../types'

const props = defineProps<{
  addComment: (comment: Comment) => void,
  postId: string,
}>()

const maxLengthCharacters: number = 256

const commentArea = ref("")
const maxCommentLength = ref([v => v.length <= maxLengthCharacters || 'Character Limit Reached'])

function handleCommentPost() {
  props.addComment({
    body: commentArea.value.trim(), 
    date: new Date(),
    postId: props.postId
  })

  commentArea.value = ""
}
</script>