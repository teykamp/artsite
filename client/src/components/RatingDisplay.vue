<template>
  <div>
    <v-container class=" d-flex flex-row">
      <v-col>
        <v-btn icon="mdi-thumb-up"></v-btn>
      </v-col>
      <v-vol>
        <v-tooltip activator="child"  :text="ratingValue + '% of people like this post.'">
          <template v-slot:activator="on">
            <v-progress-linear 
              :color="ratingValue >= 50 ? 'success' : 'error'" 
              :model-value="ratingValue"
              v-on="on"
              style="width: 10vw; "
              class="mt-8"
            >
            </v-progress-linear>
          </template>
        </v-tooltip>
      </v-vol>
      <v-col>
        <v-btn icon="mdi-thumb-down"></v-btn>
      </v-col>
    </v-container>
    <div class="text-overline d-flex align-center justify-center">
      <slot>Rating</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const ratingValue = ref(50);
</script>
