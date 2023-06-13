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
              :key="key" 
              class="text-overline noselect" 
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
        <v-menu open-on-hover :close-on-content-click="false" width="160">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-filter"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item 
                v-for="_, key in filterOptions" 
                :key="key" 
                class="text-overline noselect" 
                @click="updateFilter(key)"
              >
              <v-icon
                :style="activeFilterKeys.includes(key)  ? '' : 'opacity: 0;'"
                icon="mdi-check"
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
import axios from 'axios'
import { ref, watch } from 'vue'
import SearchBar from "./SearchBar.vue"
import type { SortOptions } from "../composables/sortItems"
import type { FilterOptions } from '../composables/filterItems'
import type { Post } from "../types"
import { navLinks } from "../router/navLinks"
import { useQueryFilter } from "../composables/useQueryFilter"
import { sortItems } from "../composables/sortItems"
import { filterItems } from "../composables/filterItems"

const props = defineProps<{
  handleDrawer: () => void,
}>()

// const search = computed({
//   get: () => props.search,
//   set: (v) => {
//     emit('update:search', v)
//   }
// })

const posts = ref<Post[]>([])

const showSearchBar = ref(false)

const filterOptions = {
  "Has: Images": (post: Post) => post.images.length !== 0,
  "i dont like D": (post: Post) => !post.title.toLowerCase().includes('d')
}


const search = ref("")
const { searchedItems: searchedPosts } = useQueryFilter(search, posts)

const { filteredPosts, activeFilterKeys } = filterItems<Post>(searchedPosts, filterOptions)

function updateFilter(newFilterKey: keyof typeof FilterOptions) {
  const newFilterKeyIndex = activeFilterKeys.value.indexOf(newFilterKey)
  if (newFilterKeyIndex !== -1) {
    return activeFilterKeys.value.splice(newFilterKeyIndex, 1)
  }
  activeFilterKeys.value.push(newFilterKey)
}

const sortOptions = {
  date: (a: Post, b: Post) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime();
  },
  title: (a: Post, b: Post) => {
    return a.title.localeCompare(b.title)
  },
  // "1st Tag": (a, b) => {
  //   if (!a.tagData) return -1
  //   if (!b.tagData) return 1
  //   if (!a.tagData.length) return -1
  //   if (!b.tagData.length) return -1

  //   return a.tagData[0].localeCompare(b.tagData[0])
  // } 
}

const { setKey, activeSortKey, ascending } = sortItems<Post>(posts, sortOptions)

const loadingPosts = ref(true)

async function fetchPosts() {
  loadingPosts.value = true
  const { data } = await axios.get("/api/posts")
  loadingPosts.value = false
  posts.value = data.reverse()
}

fetchPosts()

const emit = defineEmits(["update:posts",
                          "update:search",
                        ])

watch(filteredPosts, (newPosts) => {
  emit("update:posts", newPosts)
})
watch(search, (newSearch) => {
  emit("update:search", newSearch)
})

</script>

<style scoped>
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>