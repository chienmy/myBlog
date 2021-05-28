import Command from "./BaseCommand";
import { Terminal } from "./Terminal";
import EchoCommand from "./EchoCommand";
import LsCommand from "./LsCommand";
import ClearCommand from "./ClearCommand";
import CatCommand from "./CatCommand";
import CdCommand from "./CdCommand";

export default class CommandFactory {

  private readonly terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  private buildCommand(name: string): Command | undefined {
    switch (name) {
      case "cat":
        return new CatCommand(this.terminal);
      case "cd":
        return new CdCommand(this.terminal);
      case "clear":
        return new ClearCommand(this.terminal);
      case "echo":
        return new EchoCommand(this.terminal);
      case "ls":
        return new LsCommand(this.terminal);
      default:
        return undefined;
    }
  }

  executeCommand(command: string) {
    const commands: string[] = command.trim().split(" ");
    const commandFunc: Command = this.buildCommand(commands[0]);
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
      this.terminal.addLines(`Error: Command <#f00>${commands[0]}</#> is not supported.`);
    }
  }
}