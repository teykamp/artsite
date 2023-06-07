import { ref, Ref } from 'vue'

export type SortOptions<T> = {
  [key: string]: (a:T, b:T) => number
}

export function sortItems<T>(items: Ref<T[]>, sortOptions: SortOptions<T>) {
  
  type SortKey = keyof typeof sortOptions | null
	
  const ascending = ref(false)
  
  const activeSortKey = ref<SortKey>(null)
  function setKey(newKey: SortKey) {
    if (!newKey) {
      activeSortKey.value = null
      return
    }
    if (newKey === activeSortKey.value) {
      items.value.reverse()
      ascending.value = !ascending.value
      return
    }
    items.value.sort(sortOptions[newKey])
    activeSortKey.value = newKey
  }

	return {
    setKey,
    activeSortKey,
		sortOptions,
    ascending,
	}
}