<template>
  <div class="d-flex flex-column justify-center align-center">
    <div style="width: 50%">
      <TagInterface />
    </div>
    <h1 class="mt-4">
      Make A Post
    </h1>
    <v-form
      @submit.prevent="null"
      class="mb-10"
      style="width: 90%; max-width: 400px;"
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
      <v-text-field
        v-model="addPost.tagData"
        prepend-icon="mdi-tag"
        @keyup.enter="addPost.tagData += ','"
        label="tags"
      />
      <v-chip
        v-for="tag in tags"
        :key="tag"
        @click="removeChip(tag)"
      >
        <span class="mr-2">
          {{ tag }}
        </span>
        <v-icon>
          mdi-close-circle
        </v-icon>
      </v-chip>
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
        @click="uploadPost"
        :disabled="disablePostButton"
        color="primary"
        type="submit"
      >add post</v-btn>
    </v-form>

    <div
      style="width: 95%; height: 600px; overflow-y: scroll; border-top: 1px solid black;"
      class="d-flex flex-wrap flex-start justify-center align-start"
    >
      <div
        v-for="post in posts"
        :key="post._id"
        class="post flex-wrap flex-column justify-center align-center"
      >
        <AdminPostDisplay
          :post="post"
          @delete="deletePost(post._id)"
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
    <v-btn
      v-if="posts.length"
      @click="deletePosts"
      class="my-10"
      color="error"
    >delete all posts ({{ posts.length }})</v-btn>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import Compress from "compress.js";
import AdminPostDisplay from "../components/AdminPostDisplay.vue";
import TagInterface from "../components/TagInterface.vue";
import { ref, watch, computed } from "vue";

const posts = ref([]);
const loadingPosts = ref(false);

const addPost = ref({
  title: "",
  body: "",
  images: [] as Blob[],
  imageEncodings: [] as string[] | ArrayBuffer[],
  tagData: ref(""),
})

// const showBody = ref(false);

const disablePostButton = computed(() => {
  return !addPost.value.title
})

async function encodeImage() {
  for (let i = 0; i < addPost.value.images.length; i++) {
    const img = addPost.value.images[i];
    if (!img) {
      addPost.value.imageEncodings[i] = "";
      continue;
    }
    addPost.value.imageEncodings[i] = await compressBase64Image(img);
  }
}

watch(() => addPost.value.images, (newVal) => {
  if (newVal.length === 0) {
    addPost.value.imageEncodings = [];
  }
})

async function fetchPosts() {
  loadingPosts.value = true;
  const { data } = await axios.get("/api/posts");
  loadingPosts.value = false;
  posts.value = data.reverse();
}

async function uploadPost() {
  const newPost = {
    title: addPost.value.title,
    body: addPost.value.body,
    images: addPost.value.imageEncodings,
    tagData: addPost.value.tagData,
    date: new Date(),
  };

  const size = new TextEncoder().encode(JSON.stringify(newPost)).length
  const kiloBytes = size / 1024;
  // const megaBytes = kiloBytes / 1024;
  console.log(kiloBytes, "KB");

  await axios.post("/api/posts", newPost);
  posts.value.unshift(newPost);
  addPost.value = {
    title: "",
    body: "",
    images: [],
    imageEncodings: [],
    tagData: "",
  }
}

fetchPosts();

async function deletePosts() {
  await axios.delete("/api/posts");
  posts.value = [];
}

async function deletePost(id: string) {
  await axios.delete(`/api/posts/${id}`);
  posts.value = posts.value.filter((post) => post._id !== id);
}

async function compressBase64Image(image: string[]) {
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