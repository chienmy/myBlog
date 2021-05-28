import BaseCommand from "./BaseCommand";

export default class CatCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("cat");
  }

  execute(args: string[]): string | string[] {
    const [options, argv] = this.parseArgs(args,[1, 1]);
    const page = this.terminal.hasPage(argv[0]);
    console.log(page)
    if (page != undefined) {
      this.terminal.showArticle(argv[0]);
    } else {
      this.callError(`No such article named ${argv[0]}`);
    }
    return undefined;
  }

  tabComplete(args: string[]): [string, string] {
    const [options, argv] = this.parseArgs(args,[1, 1]);
    const page = this.terminal.getOnlyPage(argv[0]);
    if (page != undefined) {
      return [argv[0], page.title];
    }
    return undefined;
  }

}