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
          @click="$router.push(value.link)"
          :title="key" 
          :prepend-icon="value.icon"
          class="d-flex justify-center"
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
