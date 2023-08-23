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
    <div v-if="replies.length">
      <CommentDisplay v-for="reply in replies" :body="reply.body" :date="reply.date" />
    </div>
  </v-card>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dateDisplay } from '../composables/dateDisplay'
import axios from 'axios'
import type { Comment } from '../types'

const props = defineProps<{
  body: string,
  date: string,
  id?: string,
  // replies:  number,
}>()

const replies = ref<Comment[]>([])
const loadingReplies = ref(false)

async function fetchReplies() {
  if (replies.value.length === 0) {
    loadingReplies.value = true
    const { data } = await axios.get(`/api/comments/${props.id}`)
    console.log(data)
    replies.value = data.reverse()
    loadingReplies.value = false
  }
}

const { date } = dateDisplay(props.date)
</script>