<template>
  <div>
    <v-card
      width="1000"
      class="mb-6"
    >
      <v-card-title>
        {{ post.title }}
      </v-card-title>
      <v-card-subtitle
        class="mb-2"  
      >
        Posted on {{ dateDisplay }}
      </v-card-subtitle>
      <div
        class="d-flex flex-row align-center justify-center"
      >
        <img
          v-if="post.images"
          :src="post.images[0]"
          style="max-width: 1000px"
        />
      </div>
      <v-card-text
        v-if="post.body"
      >
        {{ post.body }}
      </v-card-text>
      <v-card-actions
        v-if="post.tagData"
      >
        <v-chip
          v-for="tag in parseTag(post.tagData)"
          :key="tag"
          label
          size="x-small"
          class="mr-1"
        >{{ tag }}</v-chip>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { parseTag } from "../composables/useTagParser"

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

</script>