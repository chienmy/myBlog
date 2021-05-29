import BaseCommand from "./BaseCommand";

export default class HelpCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("help")
      .description("")
      .helpOption(false);
  }

  execute(args: string[]): string | string[] {
    const [options, argv] = this.parseArgs(args,[0, 0]);
    return [
      "These shell commands are available in this terminal.",
      "Type `help name` to find out more about the function `name`",
      "cat: show the content of articles",
      "cd: enter the category directory",
      "clear: clear the screen",
      "echo: output parameters in screen",
      "ls: list categories or articles"
    ];
  }

}