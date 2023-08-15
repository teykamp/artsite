<template>
  <div>
    <v-layout>
      <v-card
      variant="outlined"
        class="mb-2"
        elevation="0"
        style="width: 90vw; min-width: 400px; max-width: 1920px;"
      >
        <v-card-title
        :class="getCurrentRoute() === `/post/${post._id}` ? '' : 'cursor-pointer hover-underline'"
          @click="checkRouteThenPush()"
        >
          {{ post.title }}
        </v-card-title>
        <v-card-subtitle
          class="mb-2"
        >
          Posted on {{ dateDisplay(post.date) }}
        </v-card-subtitle>
        <div
          class="d-flex flex-row align-center justify-center"
        >
          <img
            v-if="post.images"
            :src="post.images[0]"
            style="width: 85vw; min-width: 400px; max-width: 1920px;"
            :class="getCurrentRoute() === `/post/${post._id}` ? '' : 'cursor-pointer'"
            @click="checkRouteThenPush()"
          />
        </div>
        <div
          class="d-flex flex-row align-center justify-center"
        >
          <v-card-text
            v-if="post.body"
            style="max-width: 75ch; white-space: pre-wrap;"
          >
            {{ post.body }}
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-space-between">
            <v-col class="d-flex justify-start">
              <v-btn
                :icon="'mdi-comment-multiple-outline'"
                @click="showComments = !showComments, 
                        fetchComments()"
              ></v-btn> 
              <v-btn
                :icon="showCommentBox ? 'mdi-comment-remove-outline' : 'mdi-comment-plus-outline'"
                @click="showCommentBox = !showCommentBox"
              ></v-btn>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    v-bind="props"
                  >
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    append-icon="mdi-share"
                    @click="sharePost()"
                  >Share</v-list-item>
                  <v-list-item
                    v-if="post.images.length"
                    append-icon="mdi-open-in-new" 
                    @click="openImageInNewTab(post.images[0])"
                  >Open</v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col class="d-flex justify-end justify-sm-center" cols="6">
              <RatingDisplay 
                :interactions="post.interactions"
                :addLike="addLike"
                :addDislike="addDislike"
                :removeLike="removeLike"
                :removeDislike="removeDislike"
                :storedLikeValue="storedLikeValue"
              />
            </v-col>
            <v-col>
              <v-sheet
                style="min-width: 121px;"
                class="float-md-right float-left"
              >
                <v-chip
                  v-for="tag in post.tagData"
                  :key="tag"
                  @click="emit('update:tag-click', tag)"
                  label
                  size="x-small"
                  class="mr-1"
                >{{ tag }}</v-chip>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-expand-transition>
          <v-container v-show="showCommentBox">
            
            <CommentBox 
              :addComment="addComment"
              :postId="post._id"
            />
            
          </v-container>
        </v-expand-transition>
        
        <v-expand-transition>
          <div v-show="showComments">
            <v-card elevation="0">
              <v-card-subtitle v-if="comments.length">
                Sort Comments by
                <button 
                  v-for="_, key in sortOptions" 
                  :key="key" 
                  class="noselect text-decoration-underline"
                  style="cursor: pointer;"
                  @click="setKey(key)"
                >
                  {{ key }}
                  <v-icon
                    :style="key === activeSortKey ? '' : 'opacity: 0;'"
                    :icon="ascending ? 'mdi-arrow-up': 'mdi-arrow-down'"
                  ></v-icon>  
                </button>
              </v-card-subtitle>
                <v-sheet class="d-flex justify-center">
                  <v-col xl="7" lg="8" md="10" sm="12">
                  <!-- <div
                    v-if="loadingComments"
                    class="d-flex flex-column justify-center align-center"
                  >
                    <v-row class="pa-6">
                      <v-progress-circular
                        indeterminate
                        color="info"
                        ></v-progress-circular>
                      </v-row>
                      <v-row class="pa-6">
                        <Alert 
                        type="info"
                        title="Loading Comments..."
                        msg=""
                        />
                      </v-row>
                    </div> -->
                  <div v-for="( comment, index) in comments" :key="comment.date">
                    <CommentDisplay 
                    :body="comment.body"
                    :date="comment.date"
                    />
                    <v-divider
                    v-if="index + 1 < comments.length"
                    :key="`divider-${index}`"
                    ></v-divider>
                  </div>
                  <div
                    v-if="comments.length === 0" 
                    class="text-center text-caption"
                  >No Comments Yet!</div>
                </v-col>
              </v-sheet>
            </v-card>
          </div>
        </v-expand-transition>
      </v-card>
    </v-layout>

    <Snackbar
      v-model:showSnackbar="showSnackbar"
      :timeout="4000"
    >
      <template #content>
        <div class="text-center">
          Comment posted successfully
        </div>
      </template>
    </Snackbar>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import CommentBox from './CommentBox.vue'
import RatingDisplay from './RatingDisplay.vue'
import CommentDisplay from './CommentDisplay.vue'
import Snackbar from "./Snackbar.vue"
import { dateDisplay } from '../composables/dateDisplay'
import { handleRating } from '../functions/handleRating'
import { sortItems } from "../composables/sortItems"
import type { Comment } from '../types'


const props = defineProps<{
  post: {
    _id: string,
    title: string,
    body: string,
    date: string,
    images: string[],
    tagData: string,
    interactions: {
      likes: number,
      dislikes: number,
    },
  }
}>()

const router = useRouter()

const showCommentBox = ref(false)
const showSnackbar = ref(false)
const showComments = ref(false)

function sharePost() {
  navigator.clipboard.writeText(`${window.location.origin}/post/${props.post._id}`)
}

function getCurrentRoute(): string {
  return router.currentRoute.value.path
}

function checkRouteThenPush(): void {
  if (getCurrentRoute() !== `/post/${props.post._id}`) {
    router.push({ path: `/post/${props.post._id}` })
  }
}

function openImageInNewTab(url: string) {
  window.open(url, '_blank')
}

const comments = ref<Comment[]>([])
const loadingComments = ref(true)

async function fetchComments() {
  if (comments.value.length === 0) {
    loadingComments.value = true
    const { data } = await axios.get(`/api/comments/${props.post._id}`)
    console.log(data)
    comments.value = data.reverse()
    loadingComments.value = false
  }
}

// put into function?
let storedLikeValue = {
  postId: props.post._id,
  likes: 0,
}
const storedLikeById = localStorage.getItem(props.post._id)
if (storedLikeById !== null) {
  storedLikeValue.likes = Number(storedLikeById)
}

function addLike() {
  handleRating(`/api/post/${props.post._id}/likes/increment/`)
  localStorage.setItem(props.post._id, "1")
}

function addDislike() {
  handleRating(`/api/post/${props.post._id}/dislikes/increment/`)
  localStorage.setItem(props.post._id, "-1")
}

function removeLike() {
  handleRating(`/api/post/${props.post._id}/likes/decrement/`)
  localStorage.setItem(props.post._id, "0")
}

function removeDislike() {
  handleRating(`/api/post/${props.post._id}/dislikes/decrement/`)
  localStorage.setItem(props.post._id, "0")
}

async function addComment(comment: Comment) {
  await axios.post('/api/comments', comment)
  .catch(err => {
    console.log(err)
  })
  showCommentBox.value = false
  comments.value.unshift(comment)
  showSnackbar.value = true
  showComments.value = true
}

const sortOptions = {
  date: (a: Comment, b: Comment) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime();
  },
}

const { setKey, activeSortKey, ascending } = sortItems<Comment>(comments, sortOptions)

const emit = defineEmits([
  "update:tag-click",
])

</script>

<style scoped>
/* todo: move this so not repeated as in homeview */
.noselect {
  -webkit-touch-callout: none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
}

.hover-underline:hover {
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}
</style>