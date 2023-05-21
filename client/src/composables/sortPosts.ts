import type { Ref } from 'vue'
import { computed, ref } from 'vue'

export function sortPosts(posts: Ref<any[]>, ascending: boolean = true) {

	const sortKey = ref("date")
	
	const sortedPosts = computed(() => {
    if (ascending) return posts.value.sort((a, b) => parseFloat(a[sortKey.value]) - parseFloat(b[sortKey.value]));
		else return posts.value.sort((a, b) => parseFloat(b[sortKey.value]) - parseFloat(a[sortKey.value]));
  })


	return {
		sortedPosts,
		sortKey
	}
}