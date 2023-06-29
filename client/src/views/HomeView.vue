<template>
  <div>
    <!-- Nav -->
    <NavBar 
      v-model:handleNavDrawer="handleNavDrawer"
      @update:posts="handleLoadingPosts($event)"
      @update:search="searchValue = $event"
      ref="navBar"
    />
    <NavDrawer 
      :drawer="drawer"
    />
    
    <!-- Posts -->
    
    <div class="d-flex flex-column justify-center align-center mt-10">
      <div class="my-6"></div>
      
      <div
        v-for="(post, index) in displayPosts"
        :key="post._id"
      >
        <MainPostDisplay 
          :post="post"
          @update:tag-click="updateSearchOnTagClick($event)"
        />
        <v-divider
          v-if="index + 1 < displayPosts.length"
          :key="`divider-${index}`"
          class="my-3"
        ></v-divider>
      </div>
  
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import MainPostDisplay from "../components/MainPostDisplay.vue"
import NavBar from "../components/NavBar.vue"
import NavDrawer from "../components/NavDrawer.vue"
import type { Post } from "../types"

const displayPosts = ref<Post[]>([])
const searchValue = ref("")

const drawer = ref(false)

function handleNavDrawer() {
  drawer.value = !drawer.value
}

async function handleLoadingPosts(posts: Post[]) {
  displayPosts.value = await posts
}
const navBar = ref(null)
function updateSearchOnTagClick(tagValue: string) {
  // if navbar.value?
  navBar.value.setSearch(tagValue)
}
</script>
