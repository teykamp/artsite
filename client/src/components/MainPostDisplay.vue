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
          Posted on {{ dateDisplay }}
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
          <v-btn
            :icon="show ? 'mdi-comment-remove-outline' : 'mdi-comment-plus-outline'"
            @click="show = !show"
          ></v-btn>
          <v-spacer></v-spacer>
            <RatingDisplay>
              <v-icon 
                icon="mdi-thumbs-up-down" 
                size="x-large" 
              />
            </RatingDisplay>
          <v-spacer></v-spacer>

          <v-chip
            v-for="tag in post.tagData"
            :key="tag"
            label
            size="x-small"
            class="mr-1"
          >{{ tag }}</v-chip>
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
  import { ref, computed } from 'vue';
  import CommentBox from './CommentBox.vue'
  import RatingDisplay from './RatingDisplay.vue'

  const show = ref(false);

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