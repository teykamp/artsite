import { computed } from 'vue'

export function dateDisplay(inputDate: string) {
  
  const dateDisplay = computed(() => {
    const date = new Date(inputDate);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}`;
  });
  return {
    date: dateDisplay
  }
}
