
export type Post = {
    title: string,
    body: string,
    date: Date,
    images?: string[],
    tagData?: string[]
    interactions: {
        likes: number,
        dislikes: number
    }
}