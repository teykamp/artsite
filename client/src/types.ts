
export type Post = {
    title: string,
    body: string,
    date: string,
    images: string[],
    tagData?: string[]
    interactions: {
        likes: number,
        dislikes: number,
    }
}

export type Comment = {
    body: string,
    date: Date,
    postId: string,
}

export type Tag = {
  name: string,
  color: string,
  _id?: string,
};