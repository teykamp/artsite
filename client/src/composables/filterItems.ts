import { ref, Ref, computed } from 'vue'

export type FilterOption<T> = {
  [key: string]: (item: T) => boolean
}

export function filterItems<T>(items: Ref<T[]> , filterOptions: FilterOption<T>) {
  
  type FilterKey = keyof typeof filterOptions
  const activeFilterKeys = ref<FilterKey[]>([])

  const filteredPosts = computed(() => {
    if (!activeFilterKeys.value.length) return items.value
    return activeFilterKeys.value.map(key => filterOptions[key]).reduce((acc, fn) => {
      return acc.filter(fn)
    }, [...items.value])
  })

  return { 
    filteredPosts,
    activeFilterKeys
  }
}
