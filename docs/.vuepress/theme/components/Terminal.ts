import { PageComputed, SiteData } from "vuepress-types";
import VueRouter from 'vue-router';
import { getCategoryMap } from "../util";
import CommandFactory from "./CommandFactory";

export class Terminal {

  // 输入行显示的前缀
  private _prefix: string = "<#c13646>user</#>@<#3cbbc6>chienmy.github.io</#>";
  private _workPath: string = "";
  private _outputList: string[] = [];
  private commandHistory: string[] = [];
  private historyIndex: number = 0;
  private tempCommand: string = "";
  private commandFactory: CommandFactory;

  private siteData: SiteData;
  private router: VueRouter;
  private categoryMap: Map<string, string[]>;

  constructor(siteData: SiteData, router: VueRouter) {
    // 设置变量
    this.siteData = siteData;
    this.router = router;
    this.categoryMap = getCategoryMap(siteData.pages);
    // 设置初始显示
    this.showWelcome();
    this.commandFactory = new CommandFactory(this);
  }

  /**
   * 处理用户输入命令
   * @param command 输入的命令
   */
  inputCommand(command: string) {
    console.log(command);
    this._outputList.push(this.prefix + " " + command);
    // 命令为空直接结束
    if (command.length == 0) {
      return;
    }
    // 记录命令执行历史，并更新记录指针
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;
    // 临时命令设置为空
    this.tempCommand = "";
    this.commandFactory.executeCommand(command.trim());
  }

  // ---控制按键输入部分---
  getPreCommand(command: string): string {
    if (this.historyIndex == this.commandHistory.length) {
      this.tempCommand = command;
    }
    if (this.historyIndex > 0) {
      this.historyIndex --;
    }
    return this.commandHistory[this.historyIndex];
  }

  getNextCommand(command: string): string {
    if (this.historyIndex == this.commandHistory.length) {
      return command;
    }
    this.historyIndex ++;
    if (this.historyIndex == this.commandHistory.length) {
      return this.tempCommand;
    } else {
      return this.commandHistory[this.historyIndex];
    }
  }

  getTabCommand(command: string) {
    return this.commandFactory.tabComplete(command);
  }

  // --- Get / Set ---
  get workPath(): string {
    return this._workPath;
  }

  set workPath(path: string) {
    this._workPath = path;
  }

  get allCategories(): string[] {
    return Array.from(this.categoryMap.keys());
  }

  get prefix(): string {
    const s = this._workPath.length > 0 ? "/" : "";
    return this.transformLine(`[${this._prefix} ~${s}${this._workPath}]`);
  }

  get output(): string[] {
    return this.transformLines(this._outputList);
  }

  getPagesByCategory(category: string): PageComputed[] {
    return this.siteData.pages.filter((page) => {
      return this.categoryMap.get(category).indexOf(page.key) >= 0;
    })
  }

  hasCategory(category: string): boolean {
    return this.categoryMap.get(category) != undefined;
  }

  getPageKey(pageTitle: string): string {
    for (let page of this.siteData.pages) {
      if (page.title == pageTitle) {
        return page.key;
      }
    }
    return undefined;
  }

  getOnlyPage(pageTitle: string): PageComputed {
    const pages = this.siteData.pages.filter((page) => page.title.startsWith(pageTitle));
    if (pages.length == 1) return pages[0];
    return undefined;
  }

  /*
   *  ---工具函数部分---
   */

  // 清屏，回到初始状态
  clearScreen(): void {
    this._outputList = [];
    this.showWelcome();
  }

  // 文章跳转
  showArticle(key: string): void {
    console.log("++",key)
    this.router.push({name: key});
  }

  // 向输出中添加新行
  addLines(lines: string[] | string) {
    if (typeof lines == "string") {
      this._outputList.push(this.transformLine(lines));
    } else {
      this._outputList.push.apply(this._outputList, this.transformLines(lines));
    }
  }

  // 将自定义的格式化字符转换为html标签
  private transformLine(line: string): string {
    line = line.replace(/<(#[0-9a-f]{3,6})>/g, '<span style="color: $1">');
    line = line.replace(/<\/#>/g, '</span>');
    return line;
  }

  // transformLine的多行版本
  private transformLines(lines: string[]): string[] {
    return lines.map(value => this.transformLine(value));
  }

  // 展示欢迎信息
  private showWelcome() {
    this.addLines([
      "<#c01313>╔╦╗┌─┐┬─┐┌┬┐┬┌┐┌┌─┐┬    ╔╗ ┬  ┌─┐┌─┐</#>",
      "<#c5390d> ║ ├┤ ├┬┘│││││││├─┤│    ╠╩╗│  │ ││ ┬</#>",
      "<#c95e07> ╩ └─┘┴└─┴ ┴┴┘└┘┴ ┴┴─┘  ╚═╝┴─┘└─┘└─┘</#>" ,
      "",
      "<#b49d03>█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█</#>  Welcome to Terminal Blog v" + this.siteData.themeConfig.version + " (Powered by Vuepress 1.8.2)",
      "<#d4ba05>█░░╦─╦╔╗╦ ╔╗╔╗╔╦╗╔╗░░█</#>  * Repository: https://github.com/chienmy/myBlog",
      "<#f4d706>█░░║║║╠─║ ║ ║║║║║╠─░░█</#>  ",
      "<#d4ba05>█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█</#>  Press `help` to get more information",
      "<#b49d03>█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█</#>  Copyright © 2021 chienmy",
      ""
    ]);
  }
}
