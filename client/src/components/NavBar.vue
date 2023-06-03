<template>
  <v-app-bar :elevation="2">
      <div>
        <v-btn text @click="$router.push('/')">Home</v-btn>
        <v-btn text @click="$router.push('/about')">About</v-btn>
      </div>
      <template v-slot:append>

        <v-btn icon="mdi-magnify" @click="showSearchBar = !showSearchBar"></v-btn>

        <div class="text-center">
          <v-menu open-on-hover :close-on-content-click="false" width="120">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-sort"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item 
                v-for="_, key in sortOptions" 
                :key="key" class="text-overline noselect" 
                @click="setKey(key)"
              >
              <v-icon
                :style="key === activeSortKey ? '' : 'opacity: 0;'"
                :icon="ascending ? 'mdi-arrow-up': 'mdi-arrow-down'"
              ></v-icon>
                {{ key }}
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <v-spacer></v-spacer>
      <v-slide-x-reverse-transition v-show="showSearchBar">
          <v-col style="min-width: 140px; max-width: 400px;">
            <SearchBar
              v-model="search"
            />
          </v-col>
      </v-slide-x-reverse-transition>
    </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from "./SearchBar.vue"

const props = defineProps<{
  search: string,
  setKey: any,
  activeSortKey: any,
  sortOptions: any,
  ascending: boolean,
}>()

const emit = defineEmits([
  'update:search',
])

const search = computed({
  get: () => props.search,
  set: (v) => {
    emit('update:search', v)
  }
})

const showSearchBar = ref(false)

</script>