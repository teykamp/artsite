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
            <v-col class="d-none d-md-flex">Tags</v-col>
            <v-col class="d-none d-sm-flex">Post Stats</v-col>
            <div style="width:110px"></div>
          </v-row>
          <v-divider></v-divider>
          <div class="overflow-auto" style="max-height: 60vh">
            <div
              v-for="post in displayPosts"
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
            class="pa-10"
            style="width: 100%; text-align: center;"
          >
            Average Post Likes: {{ getPostStats.likes.toFixed(2) }} |
            Average Post Dislikes: {{ getPostStats.dislikes.toFixed(2) }} |
            Average Post Comments: {{ getPostStats.comments.toFixed(2) }}
          </v-sheet>
          
          <div class="d-flex justify-center">
              <v-btn
                v-if="displayPosts.length"
                @click="areYouSureData = {
                  content: 'Are you sure you want to delete ALL posts?',
                  action: 'Delete All Posts',
                  callbackFunction: deletePosts,
                },
                  showAreYouSureDialog = true"
                class="my-10"
                color="error"
              >delete all posts ({{ displayPosts.length }})</v-btn>
            </div>
        </v-window-item>

        <v-window-item value="new">
          <div class="d-flex flex-column justify-center align-center">
            <TagInterface />
            <h1 class="mt-4">
              Make A Post
            </h1>
            <CreateNewPost 
              :tags="tags"
              :upload-post="uploadPost"
            />
          </div>
        </v-window-item>

        <v-window-item value="database">
          <v-btn @click="areYouSureData = {
                  content: 'Are you sure you want to delete ALL comments?',
                  action: 'Delete All Comments',
                  callbackFunction: deleteComments,
                },
                  showAreYouSureDialog = true"
          >Delete All Comments</v-btn>
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
      <template #content> {{ areYouSureData.content }} </template>
      <template #actions>
        <v-btn
          color="red"
          @click="areYouSure(areYouSureData.callbackFunction)"
        > {{ areYouSureData.action }} </v-btn>
        <v-btn
          color="primary"
          @click="areYouSure()"
        >Cancel</v-btn>
      </template>
    </Dialog>

    <Snackbar
      v-model:showSnackbar="showSnackbar"
      :timeout="snackbarData.timeout"
    >
      <template #content>
        <div class="text-center">
          {{ snackbarData.content }}
        </div>
      </template>
    </Snackbar>

  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue"
import NavBar from "../components/NavBar.vue"
import AdminPostDisplay from "../components/AdminPostDisplay.vue"
import TagInterface from "../components/TagInterface.vue"
import NavDrawer from "../components/NavDrawer.vue"
import Dialog from "../components/Dialog.vue"
import Snackbar from "../components/Snackbar.vue"
import CreateNewPost from "../components/CreateNewPost.vue";
import type { Post } from "../types"

const tab = ref("posts")

const displayPosts = ref<Post[]>([])

const showAreYouSureDialog = ref(false)
const areYouSureData = ref({
  content: "",
  action: "",
  callbackFunction: () => {},
})

const showSnackbar = ref(false)

const snackbarData = ref({
  content: "",
  actions: "", 
  timeout: 4000
})

// move to composables
function areYouSure(functionCall?: () => void | Promise<void>) {
  if (functionCall) {
    // figure out how to pass variables
    functionCall()
  }
  showAreYouSureDialog.value = false
}


async function uploadPost(addPost: any) {
  const newPost = {
    title: addPost.title,
    body: addPost.body.trim(),
    images: addPost.imageEncodings,
    tagData: addPost.tagData,
    date: new Date(),
  };

  const size = new TextEncoder().encode(JSON.stringify(newPost)).length
  const kiloBytes = size / 1024
  // const megaBytes = kiloBytes / 1024;
  console.log(kiloBytes, "KB")

  await axios.post("/api/posts", newPost)

  snackbarData.value.content = "Post Added"
  showSnackbar.value = true

  displayPosts.value.unshift(newPost)

  setTimeout(() => {
    tab.value = "posts"
  }, 500)
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

async function deleteComments() {
  await axios.delete("/api/comments")
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
    postLikes += displayPosts.value[i].interactions?.likes
    postDislikes += displayPosts.value[i].interactions?.dislikes
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