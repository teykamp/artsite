import { computed } from 'vue'

export function dateDisplay(item: string) {
  
  const dateDisplay = computed(() => {
    const date = new Date(item);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}`;
  });
  return dateDisplay.value
}
