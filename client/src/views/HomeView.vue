<template>
  <div>
    <!-- Nav -->
    <NavBar 
      v-model:search="search"
      v-model:setKey="setKey"
      v-model:activeSortKey="activeSortKey"
      v-model:sortOptions="sortOptions"
      v-model:ascending="ascending"
      v-model:handleDrawer="handleDrawer"
    />

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list density="compact" nav>
        <v-list-item
          v-for="(value, key) in navLinks"
          :key="key"
          :title="key" 
          class="d-flex justify-center"
          :prepend-icon="value.icon"
          @click="$router.push(value.link)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

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
        v-else-if="posts.length === 0"
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
          :msg="'\'' + search + '\'' + ' returned no results.'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import { ref } from "vue"
import MainPostDisplay from "../components/MainPostDisplay.vue"
import Alert from "../components/Alert.vue"
import NavBar from "../components/NavBar.vue"
import { useQueryFilter } from "../composables/useQueryFilter"
import { sortItems } from "../composables/sortItems"
import type { Post } from "../types"
import { navLinks } from "../router/navLinks"

const posts = ref([])
const loadingPosts = ref(false)

const drawer = ref(false)

function handleDrawer() {
  drawer.value = !drawer.value
}

const search = ref("")
const { filteredPosts: displayPosts } = useQueryFilter(search, posts)
const { setKey, activeSortKey, sortOptions, ascending } = sortItems<Post>(posts, {
    date: (a, b) => {
      const dateA = new Date(a.date)
		  const dateB = new Date(b.date)
		  return dateB.getTime() - dateA.getTime();
		},
    title: (a, b) => {
      return a.title.localeCompare(b.title)
    },
    // "1st Tag": (a, b) => {
    //   if (!a.tagData) return -1
    //   if (!b.tagData) return 1
    //   if (!a.tagData.length) return -1
    //   if (!b.tagData.length) return -1

    //   return a.tagData[0].localeCompare(b.tagData[0])
    // } 
})

async function fetchPosts() {
  loadingPosts.value = true
  const { data } = await axios.get("/api/posts")
  loadingPosts.value = false
  posts.value = data.reverse()
}

fetchPosts()

</script>

<style scoped>
.noselect {
  -webkit-touch-callout: none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
}
</style>
