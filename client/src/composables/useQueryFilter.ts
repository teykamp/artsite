import type { Ref } from 'vue'
import { computed } from 'vue'

export function useQueryFilter(query: Ref<string>, items: Ref<any[]>) {
  const filteredPosts = computed(() => {
    return items.value.filter((item) => {
      return item.title.toLowerCase().includes(query.value.toLowerCase())
    })
  })

  return {
    filteredPosts
  }
}