<template>
  <div>
    <v-layout>
      <v-card
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
                  :icon="show ? 'mdi-comment-remove-outline' : 'mdi-comment-plus-outline'"
                  @click="show = !show"
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
          <div v-show="show">
            
            <CommentBox />
            
          </div>
        </v-expand-transition>
        <!-- comments go here -->
      </v-card>
    </v-layout>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CommentBox from './CommentBox.vue'
  import RatingDisplay from './RatingDisplay.vue'
  import { dateDisplay } from '../composables/dateDisplay'


  const show = ref(false)

  const props = defineProps<{
    post: {
      _id: string;
      title: string;
      body: string;
      date: string;
      images: string[];
      tagData: string;
      interactions: {
        likes: number,
        dislikes: number,
      },
    }
  }>()

async function addLike() {
  await fetch('/api/posts/likes/increment/' + props.post._id)
    .then(async res => {
      const data = await res.json()
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}

async function addDislike() {
  await fetch('/api/posts/dislikes/increment/' + props.post._id)
    .then(async res => {
      const data = await res.json()
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}

async function removeLike() {
  await fetch('/api/posts/likes/decrement/' + props.post._id)
    .then(async res => {
      const data = await res.json()
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}

async function removeDislike() {
  await fetch('/api/posts/dislikes/decrement/' + props.post._id)
    .then(async res => {
      const data = await res.json()
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}
</script>