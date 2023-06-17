import { Ref } from 'vue'

export function handleNavDrawer(drawer: Ref<boolean>) {
  
  drawer.value = !drawer.value
  return {
    drawer
  }
}
