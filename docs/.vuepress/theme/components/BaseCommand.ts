// 不加这行会报错：`ReferenceError: global is not defined`
(window as any).global = window;
import { Command, CommanderError, OptionValues } from "commander";
import { Terminal } from "./Terminal";

export default abstract class BaseCommand {

  protected terminal: Terminal;
  protected command = new Command();

  constructor(terminal: Terminal) {
    this.terminal = terminal;
    this.initCommand();
    this.command
      .configureOutput({
        writeOut: (str: string) => this.terminal.addLines(str.split("\n")),
        writeErr: (str: string) => this.terminal.addLines(str.split("\n").map(s => `<#f00>${s}</#>`)),
        getOutHelpWidth: () => 150,
        getErrHelpWidth: () => 150
      })
      .exitOverride((err) => {

      });
  }

  abstract initCommand(): void;

  abstract execute(args: string[]): string | string[];

  protected callError(msg: string): void {
    throw new CommanderError(2, this.command.name(), msg);
  }

  protected parseArgs(args: string[], argLimit: number[]): [OptionValues, string[]] {
    this.command.parse(args);
    const options = this.command.opts();
    const argv = this.command.args;
    console.log(args, options, argv);
    if (argv.length > argLimit[1]) {
      this.callError("too many parameters");
    } else if (argv.length < argLimit[0]) {
      this.callError("no enough parameters");
    }
    return [options, argv];
  }

}