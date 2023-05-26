import { computed } from 'vue'

interface HasDate {
  date: Date,
}

export function dateDisplay<T extends HasDate>(item: T) {
  
  const dateDisplay = computed(() => {
    const date = new Date(item.date);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}`;
  });
  return dateDisplay.value
}
