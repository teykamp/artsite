<template>
  <div class="d-flex flex-column justify-center align-center">
    
    <div class="my-6"></div>
    <div class="my-6"></div>
    <div style="width: 50%">
      <TagInterface 
        @update-tag="fetchTags"
      />
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
      <v-textarea
        v-model="addPost.body"
        prepend-icon="mdi-text"
        label="body"
        rows="2"
        auto-grow
      />
      <!-- tag map needs color -->
      <v-combobox
        v-model="addPost.tagData"
        :items="tags.map(tag => tag.name)" 
        prepend-icon="mdi-tag"
        label="tags"
        multiple
        chips
      >
        <template #selection="{ tag }">
          <v-chip
            :color="tag.color"
            class="ma-1"
          >
            {{ tag.name }}
          </v-chip>
        </template>
      </v-combobox>
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
      style="width: 95%; min-height: 200px; overflow-y: scroll; border-top: 1px solid black;"
      class="d-flex flex-wrap flex-start justify-center align-start"
    >
      <div
        v-for="post in displayPosts"
        :key="post._id"
        class="post flex-wrap flex-column justify-center align-center"
      >
        <AdminPostDisplay
          :post="post"
          @delete="deletePost(post._id)"
        />
      </div>
    </div>
    <NavBar 
      v-model:handleNavDrawer="handleNavDrawer"
      @update:posts="handleLoadingPosts($event)"
    />

    <NavDrawer 
      :drawer="drawer"
    />
    <v-btn
      v-if="displayPosts.length"
      @click="deletePosts"
      class="my-10"
      color="error"
    >delete all posts ({{ displayPosts.length }})</v-btn>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import Compress from "compress.js";
import NavBar from "../components/NavBar.vue";
import AdminPostDisplay from "../components/AdminPostDisplay.vue";
import TagInterface from "../components/TagInterface.vue";
import NavDrawer from "../components/NavDrawer.vue";
import { ref, watch, computed } from "vue";
import type { Post } from "../types"


const displayPosts = ref([]) // type this array

const addPost = ref({
  title: "",
  body: "",
  images: [] as Blob[],
  imageEncodings: [] as string[] | ArrayBuffer[],
  tagData: [],
})

const disablePostButton = computed(() => {
  return !addPost.value.title
})

async function encodeImage() {
  for (let i = 0; i < addPost.value.images.length; i++) {
    const img = addPost.value.images[i]
    if (!img) {
      addPost.value.imageEncodings[i] = ""
      continue
    }
    addPost.value.imageEncodings[i] = await compressBase64Image(img)
  }
}

watch(() => addPost.value.images, (newVal) => {
  if (newVal.length === 0) {
    addPost.value.imageEncodings = []
  }
})

async function uploadPost() {
  const newPost = {
    title: addPost.value.title,
    body: addPost.value.body.trim(),
    images: addPost.value.imageEncodings,
    tagData: addPost.value.tagData,
    date: new Date(),
  };

  const size = new TextEncoder().encode(JSON.stringify(newPost)).length
  const kiloBytes = size / 1024
  // const megaBytes = kiloBytes / 1024;
  console.log(kiloBytes, "KB")

  await axios.post("/api/posts", newPost)
  displayPosts.value.unshift(newPost)
  addPost.value = {
    title: "",
    body: "",
    images: [],
    imageEncodings: [],
    tagData: [],
  }
  // create empty comment section for posts
  // posts dont have ID until pulled from DB!!!
  await axios.post(`/api/comments/`, {postId: 123, comments: []})
  // await axios.post(`/api/comments/${displayPosts.value[0]._id}`, {id: displayPosts.value[0]._id, comments: []})

}

async function deletePosts() {
  await axios.delete("/api/posts")
  displayPosts.value = []
}

async function deletePost(id: string) {
  await axios.delete(`/api/post/${id}`)
  displayPosts.value = displayPosts.value.filter((post) => post._id !== id)
}

async function compressBase64Image(image: string[]) {
  const compress = new Compress();
  try {
    const compressedImage = await compress.compress([image], {
      size: .1, // the max size in MB, defaults to 2MB
      quality: .1, // the quality of the image, max is 1,
    })
    return compressedImage.map((image) => {
      return image.prefix + image.data
    })[0] as string
  } catch (error) {
    console.warn(error)
  }
}

const tags = ref([])
const fetchTags = async () => {
  const { data } = await axios.get("/api/tags")
  tags.value = data
}
fetchTags()


const drawer = ref(false)

function handleNavDrawer() {
  drawer.value = !drawer.value
}

async function handleLoadingPosts(posts: Post[]) {
  displayPosts.value = await posts
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