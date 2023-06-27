<template>
  <div class="d-flex flex-column justify-center align-center mt-10">
    <NavBar 
        v-model:handleNavDrawer="handleNavDrawer"
    />

    <NavDrawer 
      :drawer="drawer"
    />
    <div class="my-6"></div>
    <div class="my-6"></div>

    <Alert 
      type="info"
      title="404"
      msg="This page does not exist"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Alert from '../components/Alert.vue'
import NavBar from '../components/NavBar.vue'
import NavDrawer from '../components/NavDrawer.vue'

const drawer = ref(false)

function handleNavDrawer() {
  drawer.value = !drawer.value
}
</script>