import BaseCommand from "./BaseCommand";

export default class CdCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("cd");
  }

  execute(args: string[]): string | string[] {
    const [options, argv] = this.parseArgs(args,[1, 1]);
    if (argv[0] == "..") {
      if (this.terminal.workPath.length > 0) {
        this.terminal.workPath = "";
      }
    } else if (this.terminal.hasCategory(argv[0])) {
      this.terminal.workPath = argv[0];
    } else {
      this.callError(`No such category named ${argv[0]}`);
    }
    return undefined;
  }

}