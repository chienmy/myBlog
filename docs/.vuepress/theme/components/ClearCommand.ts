import BaseCommand from "./BaseCommand";

export default class ClearCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("clear")
      .description("clear output in screen");
  }

  execute(args: string[]): string | string[] {
    this.terminal.clearScreen();
    return undefined;
  }

}