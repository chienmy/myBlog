import { SiteData } from "vuepress-types";
import { getCategoryMap } from "../util";


type CommandFunc = (args: string[]) => void;

export class Terminal {

    // 输入行显示的前缀
    private prefix: string = "[<#c13646>user</#>@<#3cbbc6>cheinmy.github.io</#> ~]";
    private textList: string[] = [];
    private commandHistory: string[] = [];
    private commandMap = new Map<string, CommandFunc>();

    private siteData: SiteData;
    private categoryMap: Map<string, string[]>;

    constructor(siteData: SiteData) {
        // 设置变量
        this.siteData = siteData;
        this.categoryMap = getCategoryMap(siteData.pages);
        // 设置初始显示
        this.addLines([
          "╔╦╗┌─┐┬─┐┌┬┐┬┌┐┌┌─┐┬    ╔╗ ┬  ┌─┐┌─┐",
          " ║ ├┤ ├┬┘│││││││├─┤│    ╠╩╗│  │ ││ ┬",
          " ╩ └─┘┴└─┴ ┴┴┘└┘┴ ┴┴─┘  ╚═╝┴─┘└─┘└─┘"]);
        // 绑定命令，不绑定则this指向不正确
        this.bindCommand("echo", this.echoCommand);
        this.bindCommand("ls", this.lsCommand);
    }

    /**
     * 处理用户输入命令
     * @param command 输入的命令
     */
    inputCommand(command: string) {
        console.log(command);
        this.textList.push(this.prefix + " " + command);
        // 命令为空直接结束
        if (command.length == 0) {
            return;
        }
        // 记录命令执行历史
        this.commandHistory.push(command);
        const commands: string[] = command.trim().split(" ");
        const commandFunc = this.commandMap.get(commands[0]);
        if (commandFunc != undefined) {
            commandFunc(commands.slice(1));
        } else {
            this.textList.push(`Error: Command <#f00>${commands[0]}</#> not support.`)
        }
    }

    outputPrefix() {
        return this.transformLine(this.prefix);
    }

    outputText() {
        return this.transformLines(this.textList);
    }

    // ---命令处理函数部分---
    lsCommand(args: string[]) {
        if (args.length == 0) {
            this.addLines(Array.from(this.categoryMap.keys()).join(" "));
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
                this.addLines(pageNames);
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
