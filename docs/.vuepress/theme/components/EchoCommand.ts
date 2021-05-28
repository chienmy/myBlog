import BaseCommand from "./BaseCommand";
import { Command } from "commander";

export default class EchoCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("echo")
      .description("print input text");
  }

  execute(args: string[]): string | string[] {
    return args.join(" ");
  }

}