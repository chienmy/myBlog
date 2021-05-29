import BaseCommand from "./BaseCommand";

export default class CatCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("cat");
  }

  execute(args: string[]): string | string[] {
    const [options, argv] = this.parseArgs(args,[1, 1]);
    const pageKey = this.terminal.getPageKey(argv[0]);
    if (pageKey != undefined) {
      this.terminal.showArticle(pageKey);
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