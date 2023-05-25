<template>
  <div>
    <v-app-bar :elevation="2">
      <div>
        <v-btn text @click="$router.push('/')">Home</v-btn>
        <v-btn text @click="$router.push('/about')">About</v-btn>
      </div>
      <template v-slot:append>

        <v-btn icon="mdi-magnify" @click="showSearchBar = !showSearchBar"></v-btn>

        <div class="text-center">
          <v-menu open-on-hover :close-on-content-click="false" width="100">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-sort"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item 
                v-for="_, key in sortOptions" 
                :key="key" class="text-overline noselect" 
                @click="setKey(key)"
              >
              <v-icon
                :style="key === activeSortKey ? '' : 'opacity: 0;'"
                :icon="ascending ? 'mdi-arrow-up': 'mdi-arrow-down'"
              ></v-icon>
                {{ key }}
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <v-spacer></v-spacer>
      <v-slide-x-reverse-transition v-show="showSearchBar">
          <v-col style="min-width: 140px; max-width: 400px;">
            <SearchBar
              v-model="search"
            />
          </v-col>
      </v-slide-x-reverse-transition>
    </v-app-bar>

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
            color="primary"
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
import axios from "axios";
import { ref } from "vue";
import MainPostDisplay from "../components/MainPostDisplay.vue";
import SearchBar from "../components/SearchBar.vue";
import Alert from "../components/Alert.vue"
import { useQueryFilter } from "../composables/useQueryFilter";
import { sortItems } from "../composables/sortItems";
import type { Post } from "../types";

const posts = ref([]);
const loadingPosts = ref(false);

const search = ref("");
const { filteredPosts: displayPosts } = useQueryFilter(search, posts);
const { setKey, activeSortKey, sortOptions, ascending } = sortItems<Post>(posts, {
    date: (a, b) => {
      const dateA = new Date(a.date);
		  const dateB = new Date(b.date);
		  return dateA.getTime() - dateB.getTime();
		},
    title: (a, b) => {
      return a.title.localeCompare(b.title)
    },

    "First Tag": (a, b) => {
      if (!a.tagData) return -1
      if (!b.tagData) return 1
      if (!a.tagData.length) return -1
      if (!b.tagData.length) return -1

      return a.tagData[0].localeCompare(b.tagData[0])
    } 
})

const showSearchBar = ref(false);

async function fetchPosts() {
  loadingPosts.value = true;
  const { data } = await axios.get("/api/posts");
  loadingPosts.value = false;
  posts.value = data.reverse();
}

fetchPosts();

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
