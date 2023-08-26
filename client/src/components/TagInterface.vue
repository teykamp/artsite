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
      color="primary"
      class="my-2 ml-4"
    >add tag</v-btn>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import { ref } from "vue"
import { onBeforeRouteLeave } from "vue-router"
import type { Tag } from "../types"

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

onBeforeRouteLeave((to, from) => {
  if (tag.value.color.length || tag.value.name.length) {
    const answer = window.confirm(
      'Do you really want to leave? you have unsaved changes!'
    )
    if (!answer) return false
  }
})
</script>