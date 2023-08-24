<template>
  <div>
    <v-textarea
      v-model="commentArea"
      :rules="maxCommentLength"
      label="New Comment"
      auto-grow
      counter="256"
      class="mb-2 mx-8"
    ></v-textarea>
    <div class="d-flex flex-column justify-center align-center">
      <v-btn
        @click="handleCommentPost"
        :disabled="(commentArea && commentArea.length <= maxLengthCharacters) ? false : true"
        color="primary"
      >Post</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '../types'
import { onBeforeRouteLeave } from 'vue-router'

const props = defineProps<{
  addComment: (comment: Comment) => void,
  parentId: string,
}>()

const maxLengthCharacters: number = 256

const commentArea = ref("")
const maxCommentLength = ref([v => v.length <= maxLengthCharacters || 'Character Limit Reached'])

function handleCommentPost() {
  props.addComment({
    body: commentArea.value.trim(), 
    date: new Date(),
    parentId: props.parentId
  })

  commentArea.value = ""
}

onBeforeRouteLeave((to, from) => {
  if (commentArea.value) {
    const answer = window.confirm(
      'Do you really want to leave? you have unsaved changes!'
    )
    if (!answer) return false
  }
})
</script>