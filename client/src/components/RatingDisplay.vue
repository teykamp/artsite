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
        {{ likeDisplay(userLikeValue) }}
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
import { ref } from "vue";

const props = defineProps<{
  interactions: {
    likes: number,
    dislikes: number,
  },
  addLike: () => void,
  addDislike: () => void,
  removeLike: () => void,
  removeDislike: () => void,
  storedLikeValue: number,
}>()

const userLikeValue = ref(props.storedLikeValue);
// const ratingValue = computed(() => {
//   var totalLikes = props.interactions.likes;
//   var totalDislikes = props.interactions.dislikes;

//   switch (userLikeValue.value) {
//     case 1:
//       totalLikes++
//       break
//     case -1:
//       totalDislikes++
//       break
//   }
//   return totalLikes / (totalLikes + totalDislikes) * 100
// })

function handleLike() {
  if (userLikeValue.value === 1) {
    userLikeValue.value = 0
    props.removeLike()
  }

  else {
    if (userLikeValue.value === -1) 
    props.removeDislike()
    userLikeValue.value = 1
    props.addLike()
  }
}

function handleDislike() {
  if (userLikeValue.value === -1) {
    userLikeValue.value = 0
    props.removeDislike()
  }

  else {
    if (userLikeValue.value === 1) 
    props.removeLike()
    userLikeValue.value = -1
    props.addDislike()
  }
}

function likeDisplay(likeValue: number) {
  if (Math.abs(likeValue) > 999999) {
    return likeValue > 0 ? "1M+" : "-1M+"
  }
  else if (Math.abs(likeValue) > 999) {
    return `${likeValue / 1000}k`
  }
  return likeValue
}
</script>
