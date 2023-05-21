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
          <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-sort"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>Sort By:</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <div class="d-inline-block">
                  <v-icon :color="sortKey === SORTBY.likes ? 'black': 'white'">{{ sortAscending ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                  <v-btn variant="text" class="mr-2" @click="sortKey = SORTBY.likes">likes</v-btn>
                </div>
              </v-list-item>
              <v-list-item>
                <div class="d-inline-block">
                  <v-icon :color="sortKey === SORTBY.comments ? 'black': 'white'">{{ sortAscending ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon> 
                  <v-btn variant="text" class="mr-2" @click="sortKey = SORTBY.comments">comments</v-btn>
                </div>
              </v-list-item>
              <v-list-item>
                <div class="d-inline-block">
                  <v-icon :color="sortKey === SORTBY.date ? 'black': 'white'">{{ sortAscending ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                  <v-btn variant="text" class="mr-2" @click="sortKey = SORTBY.date">date</v-btn>
                </div>
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
import { sortPosts } from "../composables/sortPosts"

const SORTBY = {
  likes: 'likes',
  comments: 'comments',
  date: 'date'
}
const sortAscending = ref(true);

const posts = ref([]);
const loadingPosts = ref(false);

const search = ref("");
const { filteredPosts: searchedPosts } = useQueryFilter(search, posts);
const { sortedPosts: displayPosts, sortKey } = sortPosts(searchedPosts, sortAscending.value);
const showSearchBar = ref(false);


async function fetchPosts() {
  loadingPosts.value = true;
  const { data } = await axios.get("/api/posts");
  loadingPosts.value = false;
  posts.value = data.reverse();
}

fetchPosts();

// function updateFilteredPosts(filteredPosts: []): void {
//   posts.value = filteredPosts;
// }

</script>
