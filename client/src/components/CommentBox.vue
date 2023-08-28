<template>
  <div>
    <v-textarea
      v-model="commentText"
      :rules="commentRules"
      label="New Comment"
      auto-grow
      counter="256"
      class="mb-2 mx-8"
    ></v-textarea>
    <div class="d-flex flex-column justify-center align-center">
      <v-btn
        @click="handleCommentPost"
        :disabled="!(commentText && commentText.length <= maxLengthCharacters)"
        color="primary"
      >Post</v-btn>
      <v-btn
        @click="resolveHandler"
      >
        Resolver
      </v-btn>
      <v-btn
          @click="rejectHandler"
          color="red"
        >
          Rejecter
        </v-btn>
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

const maxLengthCharacters = 256

const rejectHandler = ref<any>(false)
const resolveHandler = ref<any>(false)

const commentText = ref("")
const commentRules = [v => v.length <= maxLengthCharacters || 'Character Limit Reached'];

function handleCommentPost() {
  props.addComment({
    body: commentText.value.trim(), 
    date: new Date(),
    parentId: props.parentId
  })

  commentText.value = ""
}

onBeforeRouteLeave(async () => {
  if (!commentText.value) {
    return true
  }

  console.log(
    'Make A Decision'
  )

  try {
    await makeDecision()
    console.log(
      'Resolved'
    )
  } catch {
    console.log(
      'Rejected'
    )
    return false
  }
})

const makeDecision = () => {
  return new Promise((resolve, reject) => {


    // this is the logic to display a dialog
    //
    //
    //  one button will call the "reject" fn, another will call the "resolve" fn. FN


    resolveHandler.value = resolve
    rejectHandler.value = reject
  })
}
</script>