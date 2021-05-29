import { EnhanceApp } from 'vuepress-types'
import VueRouter from 'vue-router';
import { MyPage } from "./type";
import { getCategoryMap } from "./util";

const enhanceApp: EnhanceApp = ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData,
  isServer
}) => {
  if (! isServer) {
    // ReferenceError: global is not defined
    (window as any).global = window;
  }

  // Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation to current location: "/".
  // const originalPush = VueRouter.prototype.push
  // VueRouter.prototype.push = (location) => {
  //   console.log(location);
  //   return originalPush.call(this, location).catch((err: any) => err)
  // }

  let categoryMap = getCategoryMap(siteData.pages);

  siteData.pages.forEach((page: MyPage) => {
    if (page.frontmatter.state === 'post' ) {
      let arr = categoryMap.get(page.frontmatter.categories[0])
      if (arr === undefined) return
      let prePage = "", nextPage = ""
      arr.forEach((a, index, arr) => {
        if (a === page.key) {
          if (index > 0) prePage = arr[index - 1]
          if (index < arr.length - 1) nextPage = arr[index + 1]
        }
      })
      // 标题中的空格全部替换
      page.title = page.title.replace(/ /ig, "_")
      page.prePage = prePage
      page.nextPage = nextPage
    }
  });
};

export default enhanceApp;
