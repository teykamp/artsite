import { computed } from 'vue';
import type { Ref } from 'vue';

export function useTagParser(tagString: Ref<string>) {
  const tagList = computed(() => {
    if (!tagString.value) return [];
    return tagString.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');
  });

  return { tagList };
}

export function parseTag(tagString: string) {
  if (!tagString) return [];
  return tagString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '');
}
