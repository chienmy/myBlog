import BaseCommand from "./BaseCommand";
import { Terminal } from "./Terminal";
import EchoCommand from "./EchoCommand";
import LsCommand from "./LsCommand";
import ClearCommand from "./ClearCommand";
import CatCommand from "./CatCommand";
import CdCommand from "./CdCommand";
import HelpCommand from "./HelpCommand";

export default class CommandFactory {

  private readonly terminal: Terminal;
  private commandMap: Map<string, BaseCommand>;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
    this.commandMap = new Map<string, BaseCommand>([
      ["cat", new CatCommand(this.terminal)],
      ["cd", new CdCommand(this.terminal)],
      ["clear", new ClearCommand(this.terminal)],
      ["echo", new EchoCommand(this.terminal)],
      ["help", new HelpCommand(this.terminal, this)],
      ["ls", new LsCommand(this.terminal)]
    ])
  }

  executeCommand(command: string) {
    const commands: string[] = command.trim().split(" ");
    const commandFunc: BaseCommand = this.commandMap.get(commands[0]);
    if (commandFunc != undefined) {
      try {
        // 在首位增加一位空位，符合nodejs的命令行参数格式
        const result = commandFunc.execute([""].concat(commands));
        if (result != undefined) {
          this.terminal.addLines(result);
        }
      } catch (err) {
        if (err.exitCode == 2) {
          this.terminal.addLines(`Error in ${err.code}: ${err.message}`);
        }
      }
    } else {
      this.terminal.addLines(`Command <#f00>${commands[0]}</#> not found.`);
    }
  }

  tabComplete(command: string): string {
    const commands: string[] = command.trim().split(" ");
    const commandFunc: BaseCommand = this.commandMap.get(commands[0]);
    if (commandFunc != undefined) {
      try {
        const completed = commandFunc.tabComplete([""].concat(commands));
        if (completed != undefined) {
          return commands.map((s) => (s == completed[0] ? completed[1] : s)).join(" ");
        }
      } catch (err) {
        return command;
      }
    } else {
      const arr = Array.from(this.commandMap.keys()).filter((c) => (c.startsWith(commands[0])))
      if (arr.length == 1) {
        return arr[0]
      }
    }
    return command;
  }
}