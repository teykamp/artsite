<template>
  <div>
    <v-row>
      <v-col>
        <v-btn 
          :icon="'mdi-thumb-down'+ (userLikeValue === -1 ? '' : '-outline')" 
          class="float-right"
          @click="userLikeValue = (userLikeValue === -1 ? 0 : -1)"
        ></v-btn>
      </v-col>
      <v-col>
        <div v-if="ratingValue">  
          <v-tooltip 
            activator="child"  
            :text="ratingValue + '% of people like this post.'"
          >
            <template v-slot:activator="on">
              <v-progress-linear
                :color="ratingValue >= 50 ? 'success' : 'error'" 
                :model-value="ratingValue"
                v-on="on"
                class="mt-5"
              >
              </v-progress-linear>
            </template>
          </v-tooltip>
        </div>
        <v-sheet 
          v-else
          class="text-center text-sm-overline mt-2"
        >
          No Ratings Yet
        </v-sheet>
      </v-col>
      <v-col>
        <v-btn 
          :icon="'mdi-thumb-up'+ (userLikeValue === 1 ? '' : '-outline')"
          @click="userLikeValue = (userLikeValue === 1 ? 0 : 1)"
        ></v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const ratingValue = ref(56);
const userLikeValue = ref(0);

</script>
