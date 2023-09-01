<template>
  <div class="d-flex flex-column justify-center align-center">
    
    <div class="my-6"></div>
    <div class="my-2"></div>
    <v-sheet
      elevation="0"
      style="width: 100%"
    >
      <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="posts">Current Posts</v-tab>
        <v-tab value="new">New Post</v-tab>
        <v-tab value="database">Database Actions</v-tab>
      </v-tabs>

      <div class="my-6"></div>
      

      <v-window v-model="tab">
        <v-window-item value="posts">
          <v-row class="text-overline">
            <div style="width: 110px;"></div>
            <v-col cols="3">Title</v-col>
            <v-col>Tags</v-col>
            <v-col class="d-none d-md-flex">Post Stats</v-col>
            <div style="width:110px"></div>
          </v-row>
          <div class="overflow-auto" style="max-height: 60vh">
            <v-divider></v-divider>
            <div
              v-for="post, index in displayPosts"
              :key="post._id"
            >
              <AdminPostDisplay
                :post="post"
                @delete="deletePost(post._id)"
              />
              <v-divider></v-divider>
            </div>
          </div>
          
          <v-sheet 
            v-if="displayPosts.length"
            style="width: 100%; text-align: center;"
          >
            Average Post Likes: {{ getPostStats.likes }}
            Average Post Dislikes: {{ getPostStats.dislikes }}
            Average Post Comments: {{ getPostStats.comments }}
          </v-sheet>
          
          <div class="d-flex justify-center">
              <v-btn
                v-if="displayPosts.length"
                @click="showAreYouSureDialog = true"
                class="my-10"
                color="error"
              >delete all posts ({{ displayPosts.length }})</v-btn>
            </div>
        </v-window-item>

        <v-window-item value="new">
          <div class="d-flex flex-column justify-center align-center">
            <TagInterface 
              @update-tag="fetchTags"
            />
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
          </div>
        </v-window-item>

        <v-window-item value="database">
          Three
        </v-window-item>
      </v-window>
    </v-sheet>

    <NavBar 
      v-model:handleNavDrawer="handleNavDrawer"
      @update:posts="handleLoadingPosts($event)"
    />

    <NavDrawer 
      :drawer="drawer"
    />
    <Dialog v-model:showDialog="showAreYouSureDialog">
      <template #content> Are you sure you want to delete ALL posts?</template>
      <template #actions>
        <v-btn
          color="red"
          @click="areYouSure(deletePosts)"
        >Delete All Posts</v-btn>
        <v-btn
          color="primary"
          @click="areYouSure()"
        >Cancel</v-btn>
      </template>
    </Dialog>

    <Dialog v-model:show-dialog="showDialog">
      <template #content>
        You have unsaved changes. Do you wish to proceed?
      </template>
      <template #actions>
        <v-btn
          @click="resolveHandler"
        >
          Continue
        </v-btn>
        <v-btn
          @click="rejectHandler"
          color="red"
        >
          Cancel
        </v-btn>
      </template>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import Compress from "compress.js"
import { ref, watch, computed } from "vue"
import NavBar from "../components/NavBar.vue"
import AdminPostDisplay from "../components/AdminPostDisplay.vue"
import TagInterface from "../components/TagInterface.vue"
import NavDrawer from "../components/NavDrawer.vue"
import Dialog from "../components/Dialog.vue"
import type { Post } from "../types"
import { dataLostOnChangePage } from '../composables/dataLostOnChangePage'

const tab = ref(null)

const displayPosts = ref<Post[]>([])

const showAreYouSureDialog = ref(false)

// move to functions
function areYouSure(functionCall?: () => void | Promise<void>) {
  if (functionCall) {
    // figure out how to pass variables
    functionCall()
  }
  showAreYouSureDialog.value = false
}

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
}

async function deletePosts() {
  await axios.delete("/api/posts")
  displayPosts.value = []
}

async function deletePost(id: string) {
  await axios.delete(`/api/post/${id}`)
  await axios.delete(`/api/comments/${id}`)
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

const { rejectHandler, resolveHandler, showDialog } = dataLostOnChangePage(() => { return (addPost.value.title.length || addPost.value.body.length || addPost.value.images.length || addPost.value.tagData.length) === 0 })

const comments = ref([])

async function getAllComments() {
  const { data } = await axios.get("/api/comments")
  comments.value = data
}

const getPostStats = computed(() => {
  let postLikes = 0
  let postDislikes = 0
  getAllComments()
  let postComments = comments.value.length

  for (let i = 0; i < displayPosts.value.length; i++) {
    postLikes += displayPosts.value[i].interactions.likes
    postDislikes += displayPosts.value[i].interactions.dislikes
  }

  return {
    likes: postLikes / displayPosts.value.length,
    dislikes: postDislikes / displayPosts.value.length,
    comments: postComments / displayPosts.value.length
  }
})

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