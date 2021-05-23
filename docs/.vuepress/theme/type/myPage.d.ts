import { Page } from "vuepress-types";

export interface MyPage extends Page {
  prePage?: string,
  nextPage?: string
}