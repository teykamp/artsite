
export type Post = {
    title: string,
    body: string,
    date: string,
    images?: string[],
    tagData?: string[]
    interactions: {
        likes: number,
        dislikes: number,
        comments?: string[],
    }
}