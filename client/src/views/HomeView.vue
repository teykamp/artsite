<template>
  <div>
    <!-- Nav -->
    <NavBar 
      v-model:handleNavDrawer="handleNavDrawer"
      @update:posts="handleLoadingPosts($event)"
      @update:search="searchValue = $event"
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
        <MainPostDisplay :post="post" />
        <v-divider
          v-if="index + 1 < displayPosts.length"
          :key="`divider-${index}`"
          class="my-3"
        ></v-divider>
      </div>
  
      <!-- No Posts Display -->
      <div
        v-if="loadingPosts"
        class="d-flex flex-column justify-center align-center"
      >
        <v-row class="pa-6">
          <v-progress-circular
            indeterminate
            color="info"
          ></v-progress-circular>
        </v-row>
        <v-row class="pa-6">
          <Alert 
            type="info"
            title="Loading Posts..."
            msg=""
          />
        </v-row>
      </div>
      <div
        v-else-if="displayPosts.length === 0 && searchValue === ''"
      >
        <Alert 
          type="error"
          title="No Posts Yet"
          msg=""
        />
      </div>
      <div
        v-else-if="displayPosts.length === 0"
      >
        <Alert 
          type="warning"
          title="No Posts Found"
          :msg="'\'' + searchValue + '\'' + ' returned no results.'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import MainPostDisplay from "../components/MainPostDisplay.vue"
import Alert from "../components/Alert.vue"
import NavBar from "../components/NavBar.vue"
import NavDrawer from "../components/NavDrawer.vue"
import type { Post } from "../types"

const displayPosts = ref<Post[]>([])
const loadingPosts = ref(true)
const searchValue = ref("")

const drawer = ref(false)

function handleNavDrawer() {
  drawer.value = !drawer.value
}

async function handleLoadingPosts(posts: Post[]) {
  displayPosts.value = await posts
  loadingPosts.value = false
}


</script>
