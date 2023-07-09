<template>
  <div>
    <h2>
      Tags
    </h2>
    <div
      class="d-flex flex-row align-center"
    >
      <v-text-field
        v-model="tag.name"
        prepend-icon="mdi-tag"
        label="name"
        class="mr-2"
      ></v-text-field>
      <v-autocomplete
        v-model="tag.color"
        :items="colors"
        :color="tag.color"
        prepend-icon="mdi-palette"
        label="color"
        class="mr-2"
      ></v-autocomplete>
    </div>
    <v-btn
      @click="addTag"
      color="primary"
      class="mb-2"
    >add tag</v-btn>
    <div>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import type { Tag } from "../types"

const tags = ref<Tag[]>([]);

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
];

const tag = ref<Tag>({
  name: '',
  color: '',
});

const tagEndpoint = '/api/tags'

const addTag = async () => {
  await axios.post(tagEndpoint, tag.value);
  tag.value = {
    name: '',
    color: '',
  };
  fetchTags();
  emit('updateTag');
};

const deleteTag = async (id: string) => {
  await axios.delete(`${tagEndpoint}/${id}`);
  tags.value = tags.value.filter((tag) => tag._id !== id);
  emit('updateTag');
};

const fetchTags = async () => {
  const { data } = await axios.get(tagEndpoint);
  tags.value = data;
};

fetchTags();
</script>