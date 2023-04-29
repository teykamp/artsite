<template>
  <div class="d-flex flex-column justify-center align-center">
    <div
      v-for="post in posts"
      :key="post._id"
    >
      <MainPostDisplay 
        :post="post"
      />
    </div>
    <div v-if="loadingPosts">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div 
      v-else-if="posts.length === 0"
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
import { ref, watch, computed } from "vue";
import MainPostDisplay from "../components/MainPostDisplay.vue";

const posts = ref([]);
const loadingPosts = ref(false);


async function fetchPosts() {
  loadingPosts.value = true;
  const { data } = await axios.get("/api/posts");
  loadingPosts.value = false;
  posts.value = data.reverse();
}

fetchPosts();

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