<template>
  <v-app>
    <router-view />
    <div style="height: 100%;"></div>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import Footer from './components/Footer.vue';
</script>