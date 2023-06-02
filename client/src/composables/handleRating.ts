export async function handleRating(destination: string, payload?: any) {
  await fetch(destination)
    .then(async res => {
      const data = await res.json()
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}