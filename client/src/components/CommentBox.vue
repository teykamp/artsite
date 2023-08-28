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
      <Dialog v-model:show-dialog="showDialog">
        <template #content>
          You have unsaved changes. Do you wish to proceed?
        </template>
        <template #actions>
          <v-btn
            @click="resolveHandler"
          >
            Continue
          </v-btn>
          <v-btn
              @click="rejectHandler"
              color="red"
            >
              Cancel
            </v-btn>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import type { Comment } from '../types'
import Dialog from './Dialog.vue'
import { dataLostOnChangePage } from '../composables/dataLostOnChangePage'

const props = defineProps<{
  addComment: (comment: Comment) => void,
  parentId: string,
}>()

const maxLengthCharacters = 256

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

const { rejectHandler, resolveHandler, showDialog } = dataLostOnChangePage(commentText)
</script>