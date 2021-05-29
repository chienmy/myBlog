import BaseCommand from "./BaseCommand";
import CommandFactory from "./CommandFactory";
import {Terminal} from "./Terminal";

export default class HelpCommand extends BaseCommand {

  private factory: CommandFactory;

  constructor(terminal: Terminal, factory: CommandFactory) {
    super(terminal);
    this.factory = factory;
  }

  initCommand(): void {
    this.command
      .name("help")
      .description("")
      .helpOption(false);
  }

  execute(args: string[]): string | string[] {
    const [options, argv] = this.parseArgs(args,[0, 1]);
    if (argv.length == 0) {
      return [
        "These shell commands are available in this terminal.",
        "Type `help name` to find out more about the function `name`",
        "",
        "cat: show the content of articles",
        "cd: enter the category directory",
        "clear: clear the screen",
        "echo: output parameters in screen",
        "ls: list categories or articles"
      ];
    } else {
      this.factory.executeCommand(argv[0] + " --help");
    }
  }

}