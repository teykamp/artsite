<template>
  <div class="mt-10">
    
    <NavBar 
      v-model:handleNavDrawer="handleNavDrawer"
    />

    <NavDrawer 
      :drawer="drawer"
    />

    <div class="my-9"></div>
    

    <v-sheet style="width: 30%; height: 15%">
      <v-textarea
        v-model="textArea"
        label="About"
      ></v-textarea>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import NavDrawer from "../components/NavDrawer.vue";

const textArea = ref("This is the about page. It's a great place to start.");

const drawer = ref(false)

function handleNavDrawer() {
  drawer.value = !drawer.value
}
</script>
