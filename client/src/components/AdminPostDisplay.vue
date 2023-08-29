<template>
  <div>
    <div :style="post.images[0] ? 'height: 175px;' : ''">
      <img
        :src="post.images[0]"
        class="thumbnail"
        alt="Post Has no Image"
      />
    </div>
    <div class="d-flex flex-row align-center">
      <h2>
        {{ post.title }}
      </h2>
      <v-spacer></v-spacer>
      <v-icon @click="emits('delete')">
        mdi-close
      </v-icon>
    </div>
    <p>
      {{ date }}
    </p>
    <div style="height: 20px;">
      <i @click="showPostActions = !showPostActions">
        {{ showPostActions ? 'Hide' : 'Show' }} post actions...
      </i>
    </div>
    <div>
      <v-expand-transition>
        <v-container v-show="showPostActions">
          <v-divider class="my-3"></v-divider>
          <div class="d-flex justify-space-around">
            <v-btn @click="showAreYouSureDialog = true">
              Clear Comments
            </v-btn>
            <!-- <v-btn>
              Clear Likes
            </v-btn> -->
            <p>Likes: {{ post.interactions.likes }}</p>
            <p>Dislikes: {{ post.interactions.dislikes }}</p>
            <!-- add number of comments when that gets stored -->
          </div>
        </v-container>
      </v-expand-transition>
      <Dialog v-model:showDialog="showAreYouSureDialog">
      <template #content> Are you sure you want to delete ALL Comments associated with this post?</template>
      <template #actions>
        <v-btn
          color="red"
          @click="areYouSure(deletePostComments)"
        >Delete All Comments</v-btn>
        <v-btn
          color="primary"
          @click="areYouSure()"
        >Cancel</v-btn>
      </template>
    </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import { ref } from "vue"
import { dateDisplay } from "../composables/dateDisplay"
import Dialog from "./Dialog.vue"

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

const { date } = dateDisplay(props.post.date)
const emits = defineEmits<{
  delete: () => void
}>()

const showPostActions = ref(false)

const showAreYouSureDialog = ref(false)

// move to functions
function areYouSure(functionCall?: () => void | Promise<void>) {
  if (functionCall) {
    functionCall()
  }
  showAreYouSureDialog.value = false
}

async function deletePostComments() {
  await axios.delete(`/api/comments/${props.post._id}`)
}
</script>

<style scoped>
img.thumbnail {
  width: 100%;
  height: 175px;
  object-fit: cover;
  border-radius: 10px;
}

i {
  cursor: pointer;
}

i:hover {
  text-decoration: underline;
  color: blue;
}

.transition {
  transition: 0.3s;
}
</style>