import { ref, Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export function dataLostOnChangePage(runCondition: () => boolean) {

  const rejectHandler = ref<any>(false)
  const resolveHandler = ref<any>(false)
  const showDialog = ref(false)

  onBeforeRouteLeave(async () => {
    if (runCondition()) {
      return true
    }
    // make decision
    showDialog.value = true
    try {
      // resolve
      await makeDecision()
      showDialog.value = false
    } catch {
      // reject
      showDialog.value = false
      return false
    }
  })

  function makeDecision() {
    return new Promise((resolve, reject) => {


      // this is the logic to display a dialog
      //
      //
      //  one button will call the "reject" fn, another will call the "resolve" fn. 


      resolveHandler.value = resolve
      rejectHandler.value = reject
    })
  }

  return {
    showDialog,
    rejectHandler,
    resolveHandler
  }
}