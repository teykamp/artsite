<template>
  <div>
    <div style="height: 175px;">
      <img
        :src="post.images[0]"
        class="thumbnail"
        alt="Cannot display image"
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
      {{ dateDisplay }}
    </p>
    <div style="height: 20px;">
      <i
        v-if="post.body || post.tagData"
        @click="showBody = !showBody"
      >
        {{ showBody ? 'Hide' : 'Show' }} post content...
      </i>
    </div>
    <div
      :style="{
        height: showBody ? '100px' : '0px',
      }"
      class="transition d-flex flex-column"
    >
      <v-divider class="my-3"></v-divider>
      <p style="max-height: 100px; overflow: auto">
        {{ post.body }}
      </p>
      <v-chip
        v-for="tag in parseTag(post.tagData)"
        :key="tag">
        {{ tag }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from "vue";
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

const emits = defineEmits<{
  delete: () => void;
}>();

const showBody = ref(false);

// const { tagData } = toRefs(props.post);
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