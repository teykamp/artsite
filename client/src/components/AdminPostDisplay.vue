<template>
  <div>

    <v-card style="height: 100px; width: 100%;" class="mb-2" elevation="0">
      <v-row>
        <v-col class="mt-5 ml-4 text-h6">
          <v-avatar
            :image="post.images[0]"
            color="surface-variant"
            size="70"
            class="mr-4"
          />
          {{ post.title }}
        </v-col>
        <v-col class="d-none d-md-flex">
          <v-chip v-for="tag in post.tagData" :key="tag">
            {{ tag }}
          </v-chip>
        </v-col>
        
        <v-col class="mt-10 d-none d-sm-flex">
          <!-- it is not displaying likes and dislikes on page yet because it doesnt have them in the post model or something!!!!! this code breaes it -->
            <v-chip variant="text" prepend-icon="mdi-thumb-up-outline" class="mr-2">
              {{ post.interactions ? post.interactions.likes : 0 }}
            </v-chip>
            <v-chip variant="text" prepend-icon="mdi-thumb-down-outline" class="mr-2">
              {{ post.interactions ? post.interactions.dislikes : 0 }}
            </v-chip>
            <v-chip variant="text" prepend-icon="mdi-comment-outline">
              <!-- {{  post.interactions.dislikes }} -->
              <!-- comments in future -->
            </v-chip>
        </v-col>
        <v-col cols="1" class="mr-4 d-flex justify-end mt-8">
          <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn 
                  variant="text" 
                  icon="mdi-dots-vertical" 
                  v-bind="props"
                ></v-btn>
            </template>
            <v-list>
              <v-list-item prepend-icon="mdi-pencil">
                Edit
              </v-list-item>
              <v-list-item prepend-icon="mdi-comment-remove-outline">
                Delete Comments
              </v-list-item>
              <v-list-item prepend-icon="mdi-thumbs-up-down">
                Delete Likes
              </v-list-item>
              <v-list-item 
                @click="emits('delete')"
                prepend-icon="mdi-delete"
              >
                Delete Post
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
      <!-- add number of comments when that gets stored -->

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
    <!-- </div> -->
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