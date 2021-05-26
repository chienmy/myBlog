import { SiteData } from "vuepress-types";
import VueRouter from 'vue-router'
import { getCategoryMap } from "../util";


type CommandFunc = (args: string[]) => void;

export class Terminal {

    // 输入行显示的前缀
    private prefix: string = "<#c13646>user</#>@<#3cbbc6>chienmy.github.io</#>";
    private path: string = "";
    private textList: string[] = [];
    private commandHistory: string[] = [];
    private historyIndex: number = 0;
    private tempCommand: string = "";
    private commandMap = new Map<string, CommandFunc>();

    private siteData: SiteData;
    private router: VueRouter;
    private categoryMap: Map<string, string[]>;

    constructor(siteData: SiteData, router: VueRouter) {
        // 设置变量
        this.siteData = siteData;
        this.router = router;
        this.categoryMap = getCategoryMap(siteData.pages);
        // 设置初始显示
        this.addLines([
          "<#c01313>╔╦╗┌─┐┬─┐┌┬┐┬┌┐┌┌─┐┬    ╔╗ ┬  ┌─┐┌─┐</#>",
          "<#c5390d> ║ ├┤ ├┬┘│││││││├─┤│    ╠╩╗│  │ ││ ┬</#>",
          "<#c95e07> ╩ └─┘┴└─┴ ┴┴┘└┘┴ ┴┴─┘  ╚═╝┴─┘└─┘└─┘</#>"]);
        // 绑定命令，不绑定则this指向不正确
        this.bindCommand("cat", this.catCommand);
        this.bindCommand("cd", this.cdCommand);
        this.bindCommand("clear", this.clearCommand);
        this.bindCommand("echo", this.echoCommand);
        this.bindCommand("ls", this.lsCommand);
    }

    /**
     * 处理用户输入命令
     * @param command 输入的命令
     */
    inputCommand(command: string) {
        console.log(command);
        this.textList.push(this.outputPrefix() + " " + command);
        // 命令为空直接结束
        if (command.length == 0) {
            return;
        }
        // 记录命令执行历史，并更新记录指针
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        // 临时命令设置为空
        this.tempCommand = "";
        const commands: string[] = command.trim().split(" ");
        const commandFunc = this.commandMap.get(commands[0]);
        if (commandFunc != undefined) {
            commandFunc(commands.slice(1));
        } else {
            this.textList.push(`Error: Command <#f00>${commands[0]}</#> not support.`)
        }
    }

    outputPrefix() {
        const s = this.path.length > 0 ? "/" : "";
        return this.transformLine(`[${this.prefix} ~${s}${this.path}]`);
    }

    outputText() {
        return this.transformLines(this.textList);
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

    }

    // ---命令处理函数部分---
    catCommand(args: string[]) {
        if (args.length == 0) {
            this.addLines("cat: Missing required arguments. Usage: cat [file_title]");
        } else {
            for (const page of this.siteData.pages) {
                if (page.title == args[0]) {
                    this.router.push(page.path);
                    return;
                }
            }
            this.addLines("cat: File not found.")
        }
    }

    cdCommand(args: string[]) {
        if (args.length == 0) {
            this.addLines("cd: Missing required arguments. Usage: cat [category_name] | ..");
        } else {
            if (args[0] == "..") {
                if (this.path.length > 0) {
                    this.path = "";
                }
            } else if (this.categoryMap.get(args[0]) != undefined) {
                this.path = args[0];
            } else {
                this.addLines("cd: No such category " + args[0]);
            }
        }
    }

    clearCommand(args: string[]) {
        this.textList = [];
        this.addLines([
            "╔╦╗┌─┐┬─┐┌┬┐┬┌┐┌┌─┐┬    ╔╗ ┬  ┌─┐┌─┐",
            " ║ ├┤ ├┬┘│││││││├─┤│    ╠╩╗│  │ ││ ┬",
            " ╩ └─┘┴└─┴ ┴┴┘└┘┴ ┴┴─┘  ╚═╝┴─┘└─┘└─┘"]);
    }

    lsCommand(args: string[]) {
        if (args.length == 0) {
            if (this.path == "") {
                this.addLines(Array.from(this.categoryMap.keys()).join(" "));
            } else {
                const pageNames = this.siteData.pages.filter((page) => {
                    return this.categoryMap.get(this.path).indexOf(page.key) >= 0;
                }).map((page) => {
                    return page.title;
                })
                this.addLines(pageNames.join(" "));
            }
        } else {
            const category = args[0];
            const keys = this.categoryMap.get(category);
            if (keys == undefined) {
                this.addLines("Error: No such category " + category);
            } else {
                const pageNames = this.siteData.pages.filter((page) => {
                    return keys.indexOf(page.key) >= 0;
                }).map((page) => {
                    return page.title;
                })
                this.addLines(pageNames.join(" "));
            }
        }
    }

    echoCommand(args: string[]) {
        this.textList.push(args.join(" "));
    }

    // ---工具函数部分---
    private bindCommand(name: string, func: CommandFunc) {
        func = func.bind(this);
        this.commandMap.set(name, func);
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

    private addLines(lines: string[] | string) {
        if (typeof lines == "string") {
            this.textList.push(this.transformLine(lines));
        } else {
            this.textList.push.apply(this.textList, this.transformLines(lines));
        }
    }
}
