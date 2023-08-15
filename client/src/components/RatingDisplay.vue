<template>
  <div>
    <v-row>
      <v-col>
        <v-btn 
          :icon="'mdi-thumb-up'+ (userLikeValue === 1 ? '' : '-outline')" 
          class="float-right"
          @click="handleLike"
        ></v-btn>
      </v-col>
      <v-col>
        <v-sheet
          class="text-center text-body mt-2"
          style=" min-width:20px"
        >  
        {{ likeDisplay() }}
        </v-sheet>
      </v-col>
      <v-col>
        <v-btn 
          :icon="'mdi-thumb-down'+ (userLikeValue === -1 ? '' : '-outline')"
          @click="handleDislike"
        ></v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  interactions: {
    likes: number,
    dislikes: number,
  },
  addLike: () => void,
  addDislike: () => void,
  removeLike: () => void,
  removeDislike: () => void,
  storedLikeValue: {
    likes: 1 | 0 | -1,
    postId: String
  },
}>()

const userLikeValue = ref<1 | 0 | -1>(props.storedLikeValue.likes);

function handleLike() {
  if (userLikeValue.value === 1) {
    userLikeValue.value = 0
    props.removeLike()
  } else {
    if (userLikeValue.value === -1) {
      props.removeDislike()
    }
    userLikeValue.value = 1
    props.addLike()
  }
}

function handleDislike() {
  if (userLikeValue.value === -1) {
    userLikeValue.value = 0
    props.removeDislike()
  } else {
    if (userLikeValue.value === 1) {
      props.removeLike()
    }
    userLikeValue.value = -1
    props.addDislike()
  }
}

const likeCount = computed(() => {
  const count = props.interactions.likes - props.interactions.dislikes + userLikeValue.value - props.storedLikeValue.likes
  if (Math.abs(count) > 999999) {
    return count > 0 ? "1M+" : "-1M+"
  } else if (Math.abs(count) > 999) {
    return `${count / 1000}k`
  }
  return count
})

function likeDisplay() {
  return likeCount.value
}
</script>
