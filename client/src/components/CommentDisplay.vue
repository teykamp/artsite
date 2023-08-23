<template>
<div>
  <v-card
    :subtitle="date"
    :text="body"
    elevation="0"
    style="{
      'max-width': '72ch',
      'white-space': 'pre-wrap'
    }"
  >
    <v-btn
      v-if="replies.length"
      @click="showReplies = !showReplies"
      variant="text"
      size="x-small"
    >{{ showReplies ? 'Hide Replies' : 'Show Replies' }}</v-btn>
    <div 
      v-if="replies.length" 
      v-show="showReplies"
    >
      <CommentDisplay 
        v-for="reply in replies"
        :key="reply._id"
        :body="reply.body" 
        :date="reply.date" 
      />
    </div>
  </v-card>
</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { dateDisplay } from '../composables/dateDisplay'
import type { Comment } from '../types'

const props = defineProps<{
  body: string,
  date: string,
  id?: string,
  // replies:  number,
}>()

const replies = ref<Comment[]>([])
const loadingReplies = ref(false)
const showReplies = ref(true)

// can use function for no repeats
async function fetchReplies() {
  if (replies.value.length === 0 && props.id !== undefined) {
    loadingReplies.value = true
    const { data } = await axios.get(`/api/comments/${props.id}`)
    replies.value = data.reverse()
    loadingReplies.value = false
  }
}

fetchReplies()

const { date } = dateDisplay(props.date)
</script>