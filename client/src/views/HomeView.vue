<template>
  <div>
    <h1>Home</h1>
    <p>
      This is the home page. It's a great place to start.
    </p>
    <p>
      <router-link to="/about">About</router-link>
    </p>
    <p>
      <router-link to="/counter">Counter</router-link>
    </p>
    <p>
      <router-link to="/fetch-data">Fetch data</router-link>
    </p>


    <v-form
      style="width: 30%"
      @submit.prevent="uploadPost"
    >
      <v-text-field
        v-model="addPost.title"
        label="title"
      />
      <v-text-field
        v-model="addPost.body"
        label="body"
      />
      <!-- needs to be base64 encoded -->
      <v-file-input
        v-model="addPost.image"
        label="image"
        prepend-icon="mdi-camera"
        accept="image/*"
      ></v-file-input>
      <v-btn
        type="submit"
      >add post</v-btn>
    </v-form>

    <v-btn
      @click="deletePosts"
      color="error"
    >delete posts</v-btn>
    <v-btn
      @click="fetchPosts"
    >fetch posts</v-btn>
    <img
      v-for="post in posts"
      :key="post._id"
      :src="post.image"
      alt="Cannot display image"
    />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

const posts = ref([]);

const addPost = ref({
  title: "",
  body: "",
  image: [],
})

async function fetchPosts() {
  const { data } = await axios.get("/api/posts");
  posts.value = data;
}

async function uploadPost() {
  console.log(addPost.value)
  const { data } = await axios.post("/api/posts", addPost.value);
  posts.value.push(data);
  addPost.value = {
    title: "",
    body: "",
    image: [],
  }
}

fetchPosts();

async function deletePosts() {
  await axios.delete("/api/posts");
  posts.value = [];
}
</script>