<template>
  <div class="d-flex flex-column justify-center align-center">
    <h1>Home</h1>
    <p>
      This is the home page. It's a great place to start.
    </p>
    <p>
      <router-link to="/about">About</router-link>
    </p>


    <v-form
      class="mb-10"
      style="width: 50%"
      @submit.prevent="uploadPost"
    >
      <v-text-field
        v-model="addPost.title"
        prepend-icon="mdi-format-title"
        label="title"
      />
      <v-text-field
        v-model="addPost.body"
        prepend-icon="mdi-text"
        label="body"
      />
      <v-file-input
        v-model="addPost.images"
        @change="encodeImage"
        multiple
        label="image"
        prepend-icon="mdi-camera"
        accept="image/*"
      ></v-file-input>
      <img 
        v-for="image in addPost.imageEncodings"
        :key="image"
        :src="image"
        class="thumbnail"
        alt="image"
      />
      <v-btn
        color="primary" 
        type="submit"
      >add post</v-btn>
    </v-form>
    <div 
      style="width: 100%;"
      class="d-flex justify-center align-center flex-wrap"
    >
      <div
        v-for="post in posts"
        :key="post._id"
        class="post flex-wrap"
      >
        <img
          :src="post.images[0]"
          class="thumbnail"
          alt="Cannot display image"
        />
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
      </div>
    </div>
    <v-btn
      v-if="posts.length"
      @click="deletePosts"
      class="my-10"
      color="error"
    >delete all posts</v-btn>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import Compress from "compress.js";
import { ref, watch } from "vue";

const posts = ref([]);

const addPost = ref({
  title: "",
  body: "",
  images: [] as Blob[],
  imageEncodings: [] as string[] | ArrayBuffer[],
})

async function encodeImage() {
  for (let i = 0; i < addPost.value.images.length; i++) {
    const img = addPost.value.images[i];
    if (!img) {
      addPost.value.imageEncodings[i] = "";
      continue;
    }
    if (typeof img === 'string') continue;
    addPost.value.imageEncodings[i] = await compressBase64Image(img);
  }
}

watch(() => addPost.value.images, (newVal) => {
  if (newVal.length === 0) {
    addPost.value.imageEncodings = [];
  }
})

async function fetchPosts() {
  const { data } = await axios.get("/api/posts");
  posts.value = data;
}

async function uploadPost() {
  const newPost = {
    title: addPost.value.title,
    body: addPost.value.body,
    images: addPost.value.imageEncodings,
  };
  await axios.post("/api/posts", newPost);
  posts.value.unshift(newPost);
  addPost.value = {
    title: "",
    body: "",
    images: [],
    imageEncodings: [],
  }
}

fetchPosts();

async function deletePosts() {
  await axios.delete("/api/posts");
  posts.value = [];
}

async function compressBase64Image(image) {
  const compress = new Compress();
  try {
    const compressedImage = await compress.compress([image], {
      size: .1, // the max size in MB, defaults to 2MB
      quality: .1, // the quality of the image, max is 1,
    })
    return compressedImage.map((image) => {
      return image.prefix + image.data;
    })[0] as string;
  } catch (error) {
    console.warn(error)
  }
}
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  margin: 10px;
  padding: 5px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  width: 40%;
}

img.thumbnail {
  width: 95%; 
  height: 300px;  
  object-fit: cover; 
  margin: 10px; 
  border-radius: 10px;
}
</style>