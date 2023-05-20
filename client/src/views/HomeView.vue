<template>
  <div>
    <v-app-bar :elevation="2">
      <div>
        <router-link to="/"><v-btn text>Home</v-btn></router-link>
        <router-link to="/about"><v-btn text>About</v-btn></router-link>
        
      </div>
      <template v-slot:append>

        <v-btn icon="mdi-magnify" @click="showSearchBar = !showSearchBar"></v-btn>

        <v-btn icon="mdi-sort"></v-btn>
      </template>
      <v-spacer></v-spacer>
      <v-expand-transition v-show="showSearchBar">
          <v-col style="min-width: 140px">
            <SearchBar
              v-model="search"
            />
          </v-col>
      </v-expand-transition>
    </v-app-bar>

    <div class="d-flex flex-column justify-center align-center mt-10">

      <div class="my-6"></div>
      
  
      <div
        v-for="(post, index) in filteredPosts"
        :key="post._id"
      >
        <MainPostDisplay :post="post" />
        <v-divider
          v-if="index + 1 < filteredPosts.length"
          :key="`divider-${index}`"
          class="my-3"
        ></v-divider>
      </div>
  
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
        v-else-if="filteredPosts.length === 0"
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

const posts = ref([]);
const loadingPosts = ref(false);

const search = ref("");
const { filteredPosts } = useQueryFilter(search, posts);
const showSearchBar = ref(false);

async function fetchPosts() {
  loadingPosts.value = true;
  const { data } = await axios.get("/api/posts");
  loadingPosts.value = false;
  posts.value = data.reverse();
}

fetchPosts();

function updateFilteredPosts(filteredPosts: []): void {
  posts.value = filteredPosts;
}
</script>
