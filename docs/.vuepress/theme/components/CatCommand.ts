import BaseCommand from "./BaseCommand";

export default class CatCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("cat");
  }

  execute(args: string[]): string | string[] {
    const [options, argv] = this.parseArgs(args,[1, 1]);
    if (this.terminal.hasPage(argv[0])) {
      this.terminal.showArticle(argv[0])
    } else {
      this.callError(`No such article named ${argv[0]}`);
    }
    return undefined;
  }

}