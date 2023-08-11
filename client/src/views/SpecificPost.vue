<template>
  <div>
    <v-btn 
      prepend-icon="mdi-arrow-left" 
      class="ma-2"
      @click="$router.go(-1)"
    >Back</v-btn>
    <div class="d-flex justify-center">
      <MainPostDisplay :post="post" />
    </div>
    <v-row class="d-flex justify-space-between mt-2">
      <v-btn 
        prepend-icon="mdi-arrow-left" 
        class="ml-10"
        @click="onClickNextButton(-1)"
      >Previous Post</v-btn>
      <v-btn 
        append-icon="mdi-arrow-right" 
        class="mr-10"
        @click="onClickNextButton(1)"
      >Next Post</v-btn>
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
const postsList = ref<Post[]>([])
const postIndex = ref<number | null>(null)
const route = useRoute()
const postId = route.params.postId

// add loading icon here 
async function fetchPost(postId: string): Promise<void> {
  try {
    const { data } = await axios.get(`/api/post/${postId}`)
    post.value = data
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error)
  }
}

function checkCachedPosts() {
  if (localStorage.getItem("posts")) {
    postsList.value = JSON.parse(localStorage.getItem("posts")!)
    post.value = postsList.value.find(post => post._id === postId)
    postIndex.value = postsList.value.findIndex(post => post._id === postId)
  } else {
    fetchPost(String(postId))
  }
}

checkCachedPosts()

// extract checking into separate function
function onClickNextButton(direction: 1 | -1) {
  if (postIndex.value !== null) {
    const newIndex = postIndex.value + direction;
    const isValidIndex = newIndex >= 0 && newIndex < postsList.value.length;
    if (isValidIndex) {
      postIndex.value = newIndex;
      post.value = postsList.value[newIndex];
    }
  }
}
</script>
