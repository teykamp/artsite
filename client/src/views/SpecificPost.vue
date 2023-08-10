<template>
  <div>
    <v-btn prepend-icon="mdi-arrow-left" class="ma-2">Back</v-btn>

    <div class="d-flex justify-center">
      <MainPostDisplay :post="post" />
    </div>
    <v-row class="d-flex justify-space-between mt-2">
      <v-btn prepend-icon="mdi-arrow-left" class="ml-10">Previous Post</v-btn>
      <v-btn append-icon="mdi-arrow-right" class="mr-10">Next Post</v-btn>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import MainPostDisplay from '../components/MainPostDisplay.vue';
import type { Post } from '../types'

const post = ref<Post>()

// add cache check code here
// if all posts are cached can use cached posts as a next and prev buttons
// add loading icon here 
async function fetchPost(postId: string): Promise<void> {
  try {
    const { data } = await axios.get(`/api/post/${postId}`)
    post.value = data
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error)
  }
}

const route = useRoute()
fetchPost(String(route.params.postId))
</script>
