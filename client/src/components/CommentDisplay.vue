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
      v-if="parentId !== undefined"
      @click="showReplyBox = !showReplyBox"
      append-icon="mdi-reply"
      variant="text"
      size="x-small"
    >Reply</v-btn>
    <CommentBox
      v-if="parentId !== undefined"
      v-show="showReplyBox"
      :addComment="addReply"
      :parentId="parentId"
    ></CommentBox>

    <v-btn
      v-if="replies.length"
      @click="showReplies = !showReplies"
      variant="text"
      size="x-small"
    >{{ showReplies ? 'Hide Replies' : 'Show Replies' }}</v-btn>
    <div 
      v-if="parentId !== undefined && replies.length" 
      v-show="showReplies"
      class="ml-4"
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
import CommentBox from './CommentBox.vue'
import { dateDisplay } from '../composables/dateDisplay'
import type { Comment } from '../types'

const props = defineProps<{
  body: string,
  date: string,
  parentId?: string,
  // replies:  number,
}>()

const replies = ref<Comment[]>([])
const loadingReplies = ref(false)
const showReplies = ref(false)
const showReplyBox = ref(false)

// can use function for no repeats
async function fetchReplies() {
  if (replies.value.length === 0 && props.parentId !== undefined) {
    loadingReplies.value = true
    const { data } = await axios.get(`/api/comments/${props.parentId}`)
    replies.value = data.reverse()
    loadingReplies.value = false
  }
}

fetchReplies()

async function addReply(reply: Comment) {
  console.log('adding' + reply.body)
  await axios.post('/api/comments', reply)
    .catch(err => {
      console.log(err)
    })
  showReplyBox.value = false
  replies.value.unshift(reply)
  showReplies.value = true
}

const { date } = dateDisplay(props.date)
</script>