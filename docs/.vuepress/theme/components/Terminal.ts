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

    // getTabCommand(command: string) {
    //     if (command.length == 0) {
    //         return "";
    //     }
    //     const commands: string[] = command.trim().split(" ");
    //     if (commands.length == 1) {
    //         const candidates = Array.from(this.commandMap.keys()).filter((name) => {
    //             return name.startsWith(commands[0]);
    //         })
    //         if (candidates.length == 1) {
    //             return candidates[0];
    //         }
    //     } else {
    //
    //     }
    //     return command;
    // }

    // ---Get函数部分---
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

    hasPage(pageTitle: string): boolean {
        this.siteData.pages.forEach((page) => {
            if (page.title == pageTitle) {
                return true;
            }
        });
        return false;
    }

    // ---工具函数部分---
    clearScreen(): void {
        this._outputList = [];
        this.showWelcome();
    }

    showArticle(title: string): void {
        for (const page of this.siteData.pages) {
            if (page.title == title) {
                this.router.push(page.path);
                return;
            }
        }
    }

    /**
     * 将自定义的格式化字符转换为html标签
     * @param line 一次转换一行
     */
    private transformLine(line: string): string {
        line = line.replace(/<(#[0-9a-f]{3,6})>/g, '<span style="color: $1">');
        line = line.replace(/<\/#>/g, '</span>');
        return line;
    }

    /**
     * transformLine的多行版本
     * @param lines 代表多行文本
     */
    private transformLines(lines: string[]): string[] {
        return lines.map(value => this.transformLine(value));
    }

    addLines(lines: string[] | string) {
        if (typeof lines == "string") {
            this._outputList.push(this.transformLine(lines));
        } else {
            this._outputList.push.apply(this._outputList, this.transformLines(lines));
        }
    }

    private showWelcome() {
        this.addLines([
            "<#c01313>╔╦╗┌─┐┬─┐┌┬┐┬┌┐┌┌─┐┬    ╔╗ ┬  ┌─┐┌─┐</#>",
            "<#c5390d> ║ ├┤ ├┬┘│││││││├─┤│    ╠╩╗│  │ ││ ┬</#>",
            "<#c95e07> ╩ └─┘┴└─┴ ┴┴┘└┘┴ ┴┴─┘  ╚═╝┴─┘└─┘└─┘</#>"]);
    }
}
