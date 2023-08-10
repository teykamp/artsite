<template>
  <div class="d-flex justify-center">
    <MainPostDisplay :post="post" />
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