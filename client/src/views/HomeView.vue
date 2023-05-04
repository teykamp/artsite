<template>
  <div class="d-flex flex-column justify-center align-center">
    <SearchBar
      v-model="search"
    />
    <div
      v-for="(post, index) in filteredPosts"
      :key="post._id"
    >
      <MainPostDisplay
        :post="post"
      />
      <v-divider
        v-if="index + 1 < filteredPosts.length"
        :key="`divider-${index}`"
        class="mt-3 mb-3"
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
        <h3>Loading Posts...</h3>
      </v-row>
    </div>
    <div
      v-else-if="filteredPosts.length === 0"
      style="color: red;"
    >
      <h2>
        No posts yet
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { ref } from "vue";
  import MainPostDisplay from "../components/MainPostDisplay.vue";
  import SearchBar from "../components/SearchBar.vue";
  import { useQueryFilter } from "../composables/useQueryFilter";

  const posts = ref([]);
  const loadingPosts = ref(false);

  const search = ref("");
  const { filteredPosts } = useQueryFilter(search, posts);

  async function fetchPosts() {
    loadingPosts.value = true;
    const { data } = await axios.get("/api/posts");
    loadingPosts.value = false;
    posts.value = data.reverse();
  }

  fetchPosts();

  function updateFilteredPosts(filteredPosts: []) {
    posts.value = filteredPosts;
  };

</script>

<style scoped>
.post {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  width: 30%;
}

img.thumbnail {
  width: 100%;
  height: 175px;
  object-fit: cover;
  border-radius: 10px;
}
</style>