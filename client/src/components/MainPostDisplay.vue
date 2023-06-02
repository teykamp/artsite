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
        <v-card-text
          v-if="post.body"
        >
          {{ post.body }}
        </v-card-text>
        <v-card-actions>
            <v-row class="d-flex justify-space-around">
              <!-- left -->
              <v-col>
                <v-btn
                  :icon="showCommentBox ? 'mdi-comment-remove-outline' : 'mdi-comment-plus-outline'"
                  @click="showCommentBox = !showCommentBox"
                ></v-btn> 
              </v-col>
              <!-- middle -->
              <v-col cols="8">
                  <RatingDisplay 
                    :interactions="post.interactions"
                    :addLike="addLike"
                    :addDislike="addDislike"
                    :removeLike="removeLike"
                    :removeDislike="removeDislike"
                  />
              </v-col>
              <v-col>
                <!-- right -->
                <v-sheet
                  style="min-width: 130px;"
                  class="sm-and-up-float-right xs-float-left"
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
          <div v-show="showCommentBox">
            
            <CommentBox 
              :addComment="addComment"
            />
            
          </div>
        </v-expand-transition>
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
import { Comment } from '../types'



const showCommentBox = ref(false)
const showSnackbar = ref(false)


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

function addLike() {
  handleRating('/api/posts/likes/increment/' + props.post._id)
}

function addDislike() {
  handleRating('/api/posts/dislikes/increment/' + props.post._id)
}

function removeLike() {
  handleRating('/api/posts/likes/decrement/' + props.post._id)
}

function removeDislike() {
  handleRating('/api/posts/dislikes/decrement/' + props.post._id)
}

async function addComment(comment: Comment) {
  await axios.post('/api/posts/comments/' + props.post._id, comment)
  .catch(err => {
    console.log(err)
  })
  showCommentBox.value = false
  showSnackbar.value = true
  props.post.interactions.comments.unshift(comment)
}
</script>