import type { ref, Ref } from 'vue'

export type FilterOptions = {
  [key: string]: {
    prop: string,
    val: any
  }
}

export function filterItems<T>(items: Ref<T[]> , filterOptions:FilterOptions) {
  // type FilterKey = keyof typeof filterOptions | null

  items.value.filter((item) => item[filterOptions.prop] === filterOptions.val)

    return { 
      filterOptions
    }
}
