<template>
  <v-app-bar :elevation="2">
    <v-app-bar-nav-icon
      @click.stop="handleDrawer()" 
      class="d-flex d-sm-none"
    ></v-app-bar-nav-icon>
    <div class="hidden-xs ml-3">
      <v-btn 
        v-for="(value, key) in navLinks"
        :key="key"
        :text="value.buttonType === 'text'"
        :icon="value.buttonType === 'icon'"
        :prepend-icon="value.icon"
        @click="$router.push(value.link)"
      >
      {{value.buttonType === 'text' ? key : ''}}
        <v-icon 
          v-if="value.buttonType === 'icon'" 
          :icon="value.icon"
        ></v-icon>
      </v-btn>
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
        <v-row class="flex-row-reverse">
          <v-col xl="8" lg="8" md="10" sm="12" xs="12">
            <SearchBar
              v-model="search"
            />
          </v-col>
        </v-row>
    </v-slide-x-reverse-transition>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from "./SearchBar.vue"
import type { SortOptions } from "../composables/sortItems"
import type { Post } from "../types"
import { navLinks } from "../router/navLinks"

const props = defineProps<{
  search: string,
  setKey: (key: any) => void,
  activeSortKey: string | null,
  sortOptions: SortOptions<Post>,
  ascending: boolean,
  handleDrawer: () => void,
}>()

const emit = defineEmits([
  'update:search',
  'update:drawer'
])

const search = computed({
  get: () => props.search,
  set: (v) => {
    emit('update:search', v)
  }
})

const showSearchBar = ref(false)
</script>