<template>
  <div>
    <div style="height:65px"></div>
    <NavBar
      v-model:handleNavDrawer="handleNavDrawer"
      :loadPosts="false"
    />
    <NavDrawer 
      :drawer="drawer"
    />
    <div v-if="checkHistory()" class="my-12"></div>
    <v-btn
      v-if="!checkHistory()"
      @click="$router.go(-1)"
      prepend-icon="mdi-arrow-left" 
      variant="plain"
      class="ma-2"
    >Back</v-btn>
    <div class="d-flex justify-center">
      <MainPostDisplay 
        :post="post"
        :key="post?._id"
      />
    </div>
    <v-row class="d-flex justify-space-between mt-2">
      <v-btn
        @click="onClickNextButton(-1)"
        :disabled="!checkInRange(-1)"
        prepend-icon="mdi-arrow-left" 
        variant="plain" 
        class="ml-10"
      >Previous Post</v-btn>
      <v-btn
        @click="onClickNextButton(1)"
        :disabled="!checkInRange(1)"
        append-icon="mdi-arrow-right" 
        variant="plain"
        class="mr-10"
      >Next Post</v-btn>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainPostDisplay from '../components/MainPostDisplay.vue'
import NavBar from "../components/NavBar.vue"
import NavDrawer from "../components/NavDrawer.vue"
import type { Post } from '../types'

const post = ref<Post & { _id: string }>()
const postsList = ref<Post[]>([])
const postIndex = ref<number | null>(null)
const route = useRoute()
const router = useRouter()
const postId = route.params.postId
const drawer = ref(false)

function handleNavDrawer() {
  drawer.value = !drawer.value
}

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
    const postsMap = new Map(postsList.value.map(post => [post._id, post]))
    post.value = postsMap.get(postId)
    postIndex.value = postsList.value.findIndex(post => post._id === postId)
  } else {
    fetchPost(String(postId))
  }
}

function onClickNextButton(direction: 1 | -1) {
  if (postIndex.value !== null && checkInRange(direction)) {
    const newIndex = postIndex.value + direction
    postIndex.value = newIndex
    post.value = postsList.value[newIndex]
    router.replace({ path: `/post/${ post.value?._id }`} )
  }
}

function checkInRange(direction: 1 | -1): boolean {
  if (postIndex.value !== null) {
    const newIndex = postIndex.value + direction
    const isValidIndex = newIndex >= 0 && newIndex < postsList.value.length
    if (isValidIndex) {
      return true
    }
    return false
  }
  return false
}

function checkHistory() {
  return window.history.length === 2
}

checkCachedPosts()
</script>
