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
async function fetchPost(postId: string) {
  const { data } = await axios.get(`/api/post/${postId}`)
  post.value = data
}

const route = useRoute()
fetchPost(String(route.params.postId))

</script>