<template>
  <div>
    <h1>{{ post.title }}</h1>
    <img
      v-if="post.images"
      :src="post.images[0]"
      class="thumbnail"
      fill
      width="900"
    />
    <p>{{ post.body }}</p>
    <p>{{ dateDisplay }}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  // import tagDisplay from '../scripts/tagDisplay';

  const props = defineProps<{
    post: {
      _id: string;
      title: string;
      body: string;
      date: string;
      images: string[];
      tagData: string;
    };
  }>();

  const dateDisplay = computed(() => {
  const date = new Date(props.post.date);
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}`;
});

  // const tags = tagDisplay.parseTags(props.post.tagData)
</script>