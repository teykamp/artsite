
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

export type Comment = {
    body: string,
    date: string,
}

export type Tag = {
  name: string;
  color: string;
  _id?: string;
};