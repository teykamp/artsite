<template>
  <div>
    <h2 class="ml-4">
      Tags
    </h2>
    <v-row class="d-flex align-center ma-6">
      <v-text-field
        v-model="tag.name"
        prepend-icon="mdi-tag"
        label="name"
        class="mx-2"
        style="width: 300px;"
      ></v-text-field>
      <v-autocomplete
        v-model="tag.color"
        :items="colors"
        :color="tag.color"
        prepend-icon="mdi-palette"
        label="color"
        class="mr-2"
        style="width: 300px;"
      ></v-autocomplete>
    </v-row>
    <div class="ml-4">
      <v-chip
        v-for="tag in tags"
        :key="tag.name"
        :color="tag.color"
      >
        {{ tag.name }}
        <v-icon
          @click="deleteTag(tag._id)"
          class="ml-2"
        >
          mdi-close-circle
        </v-icon>
      </v-chip>
    </div>
    <v-btn
      @click="addTag"
      :disabled="tag.name === '' || colors.indexOf(tag.color) === -1"
      color="primary"
      class="my-2 ml-4"
    >add tag</v-btn>

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
import axios from "axios"
import { ref } from "vue"
import Dialog from "./Dialog.vue"
import type { Tag } from "../types"
import { dataLostOnChangePage } from "../composables/dataLostOnChangePage"

const tags = ref<Tag[]>([])

const emit = defineEmits<{
  (e: 'updateTag'): void
}>()

const colors = [
  'grey',
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'pink',
  'orange',
  'brown',
  'black',
]

const tag = ref<Tag>({
  name: '',
  color: '',
})

const tagEndpoint = '/api/tags'

const addTag = async () => {
  await axios.post(tagEndpoint, tag.value)
  tag.value = {
    name: '',
    color: '',
  }
  fetchTags()
  emit('updateTag')
}

const deleteTag = async (id: string) => {
  await axios.delete(`/api/tag/${id}`)
  tags.value = tags.value.filter((tag) => tag._id !== id)
  emit('updateTag')
};

const fetchTags = async () => {
  const { data } = await axios.get(tagEndpoint)
  tags.value = data
}

fetchTags()

const { rejectHandler, resolveHandler, showDialog } = dataLostOnChangePage(() => { return ((tag.value.color.length || tag.value.name.length)) === 0 })
</script>