<template>
  <div>
    <v-layout>
      <v-card
      variant="outlined"
        class="mb-2"
        elevation="0"
        style="width: 90vw; min-width: 400px; max-width: 1920px;"
      >
        <v-card-title>
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
                    @click="showComments = !showComments"
                    :disabled="comments.length === 0 ? true : false"
                  ></v-btn> 
                  <v-btn
                    :icon="showCommentBox ? 'mdi-comment-remove-outline' : 'mdi-comment-plus-outline'"
                    @click="showCommentBox = !showCommentBox"
                  ></v-btn>
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
            />
            
          </v-container>
        </v-expand-transition>
        
        <v-expand-transition>
          <div v-show="showComments">
            <v-card elevation="0">
              <v-card-subtitle>
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
            </v-card>
            <v-sheet class="d-flex justify-center">
              <v-col xl="7" lg="8" md="10" sm="12">
                <div v-for="( comment, index) in post.interactions.comments" :key="comment.date">
                  <CommentDisplay 
                    :body="comment.body"
                    :date="comment.date"
                  />
                  <v-divider
                    v-if="index + 1 < post.interactions.comments.length"
                    :key="`divider-${index}`"
                  ></v-divider>
                </div>
              </v-col>
            </v-sheet>
          </div>
        </v-expand-transition>
      </v-card>
    </v-layout>

    <v-snackbar
        v-model="showSnackbar"
        :timeout="4000"
        color="success"
      >
      <div class="text-center">
        Comment posted successfully
      </div>
      </v-snackbar>

  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from 'vue';
import CommentBox from './CommentBox.vue'
import RatingDisplay from './RatingDisplay.vue'
import CommentDisplay from './CommentDisplay.vue';
import { dateDisplay } from '../composables/dateDisplay'
import { handleRating } from '../functions/handleRating'
import { sortItems } from "../composables/sortItems"
import type { Comment } from '../types'



const showCommentBox = ref(false)
const showSnackbar = ref(false)
const showComments = ref(false)


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
      comments: Comment[],
    },
  }
}>()

const comments = ref(props.post.interactions.comments)

let storedLikeValue = 0
const storedLikeById = localStorage.getItem(props.post._id)
if (storedLikeById !== null) {
  storedLikeValue = Number(storedLikeById)
}

function addLike() {
  handleRating('/api/posts/likes/increment/' + props.post._id)
  localStorage.setItem(props.post._id, "1")
}

function addDislike() {
  handleRating('/api/posts/dislikes/increment/' + props.post._id)
  localStorage.setItem(props.post._id, "-1")
}

function removeLike() {
  handleRating('/api/posts/likes/decrement/' + props.post._id)
  localStorage.setItem(props.post._id, "0")
}

function removeDislike() {
  handleRating('/api/posts/dislikes/decrement/' + props.post._id)
  localStorage.setItem(props.post._id, "0")
}

async function addComment(comment: Comment) {
  await axios.post('/api/posts/comments/' + props.post._id, comment)
  .catch(err => {
    console.log(err)
  })
  showCommentBox.value = false
  props.post.interactions.comments.unshift(comment)
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
</style>