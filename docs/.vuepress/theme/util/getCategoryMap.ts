import { PageComputed } from "vuepress-types";

function addToMap(map: Map<string, string[]>, arr: string[], page: string) {
  arr.forEach((a) => {
    if (map.has(a)) {
      let oldPages = map.get(a)
      oldPages.push(page)
      map.set(a, oldPages)
    }
    else map.set(a, [page])
  })
}

export const getCategoryMap = (pages: PageComputed[]) => {
  let categoryMap = new Map<string, string[]>();
  pages.forEach((page) => {
    if (page.frontmatter.state === 'post') {
      let categories = page.frontmatter.categories ? [page.frontmatter.categories[0]] : ["未分类"]
      addToMap(categoryMap, categories, page.key)
    }
  });
  return categoryMap;
}