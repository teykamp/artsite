<template>
  <div>
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

  </div>
</template>

<script setup lang="ts">
import { navLinks } from "../router/navLinks"
import { computed } from 'vue'

const props = defineProps<{
  drawer: boolean,
}>()

const emits = defineEmits([
  "update:drawer"
])

const drawer = computed({
  get: () => props.drawer,
  set: () => emits("update:drawer")
})

</script>
