<template>
  <div>
    <div class="d-flex justify-center" style="width: 90vw;">
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
        <div v-if="!props.defaultValues">
          <v-file-input
            v-model="addPost.images"
            @change="encodeImage"
            multiple
            label="image"
            prepend-icon="mdi-camera"
            accept="image/*"
          ></v-file-input>
          fdsghfsd
          <img
            v-for="image in addPost.imageEncodings"
            :key="image"
            :src="image"
            class="thumbnail"
            alt="image"
          />
        </div>
        <div v-if="props.defaultValues && props.defaultValues.image">
          <img 
            :src="props.defaultValues.image"
            style="max-width: 300px; max-height: 500px;"
          />
        </div>
        <v-btn
          @click="uploadPostHelper"
          :disabled="disablePostButton"
          color="primary"
          type="submit"
        >{{ props.defaultValues ? 'Update Post' : 'Add Post' }}</v-btn>
      </v-form>
    </div>
    
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
import Compress from "compress.js"
import { ref, watch, computed } from 'vue'
import Dialog from './Dialog.vue'
import type { Tag } from '../types'
import { dataLostOnChangePage } from '../composables/dataLostOnChangePage'

const props = defineProps<{
  uploadPost: (newPost: any) => void,
  tags: Tag[],
  defaultValues?: {
    title: string,
    body: string,
    tagData: string,
    image: string,
  }
}>()

const addPost = ref({
  title: props.defaultValues ? props.defaultValues.title : "",
  body: props.defaultValues ? props.defaultValues.body : "",
  images: [] as Blob[],
  imageEncodings: [] as string[] | ArrayBuffer[],
  tagData: props.defaultValues ? props.defaultValues.tagData : [],
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

watch(() => addPost.value.images, (newVal) => {
  if (newVal.length === 0) {
    addPost.value.imageEncodings = []
  }
})

function uploadPostHelper() {
  props.uploadPost(addPost.value)
  addPost.value = {
    title: "",
    body: "",
    images: [],
    imageEncodings: [],
    tagData: [],
  }
}

const { rejectHandler, resolveHandler, showDialog } = dataLostOnChangePage(() => { return (addPost.value.title.length || addPost.value.body.length || addPost.value.images.length || addPost.value.tagData.length) === 0 })

</script>