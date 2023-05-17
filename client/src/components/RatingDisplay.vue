<template>
  <div>
    <v-row class=" d-flex flex-row">
      <v-col>
        <v-btn icon="mdi-thumb-down"></v-btn>
      </v-col>
      <v-col>
        <div v-if="ratingValue">  
          <v-tooltip activator="child"  :text="ratingValue + '% of people like this post.'">
            <template v-slot:activator="on">
              <v-progress-linear
                :color="ratingValue >= 50 ? 'success' : 'error'" 
                :model-value="ratingValue"
                v-on="on"
                style="width: 10vw; "
                class="mt-5"
              >
              </v-progress-linear>
            </template>
          </v-tooltip>
        </div>
        <v-sheet 
          v-else
          class="text-center text-sm-overline mt-3"
          style="width: 10vw; "
        >
          No Ratings Yet
        </v-sheet>
      </v-col>
      <v-col>
        <v-btn icon="mdi-thumb-up"></v-btn>
      </v-col>
    </v-row>
      <div class="text-overline d-flex align-center justify-center mb-6">
        <slot>Rating</slot>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const ratingValue = ref(20);
</script>
