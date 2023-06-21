import type { Ref } from 'vue'
import { computed } from 'vue'

export function useQueryFilter(query: Ref<string>, items: Ref<any[]>) {
  const searchedItems = computed(() => {
    return items.value.filter((item) => {
      return item.tagData.some((tag) => tag.includes(query.value)) 
      || (item.tagData.length === 0 && query.value === '')
      || item.title.toLowerCase().includes(query.value.toLowerCase()) 
    })
  })

  return {
    searchedItems
  }
}