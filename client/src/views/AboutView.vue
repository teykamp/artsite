<template>
  <div>
    <NavBar 
      v-model:handleDrawer="handleDrawer"
    />

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list density="compact" nav>
        <v-list-item
          v-for="(value, key) in navLinks"
          :key="key"
          :title="key" 
          class="d-flex justify-center"
          :prepend-icon="value.icon"
          @click="$router.push(value.link)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>


    <div style="width: 30%; height: 15%">
      <v-textarea
        v-model="textArea"
        label="About"
      ></v-textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import { navLinks } from "../router/navLinks"


const textArea = ref("This is the about page. It's a great place to start.");

const drawer = ref(false)

function handleDrawer() {
  drawer.value = !drawer.value
}
</script>
