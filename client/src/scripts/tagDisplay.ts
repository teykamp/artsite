export default function parseTags(tagString: string): string[] {
    const tagList: string[] = tagString
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag) => tag !== '');
      
    return tagList;
  }
