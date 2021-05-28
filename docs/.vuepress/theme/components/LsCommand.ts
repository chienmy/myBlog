import BaseCommand from "./BaseCommand";
import * as moment from 'moment';

export default class LsCommand extends BaseCommand {

  initCommand(): void {
    this.command
      .name("ls")
      .option("-l, --list", "list categories or articles");
  }

  execute(args: string[]): string | string[] {
    const [options, argv] = this.parseArgs(args,[0, 1]);
    if (argv.length == 0) {
      if (this.terminal.workPath == "") {
        return this.terminal.allCategories.join(" ");
      }
    } else {
      const category = argv.length == 0 ? this.terminal.workPath : argv[0];
      if (! this.terminal.hasCategory(category)) {
        this.callError(`No such category named ${category}`);
      }
      const pages = this.terminal.getPagesByCategory(category);
      if (options["list"]) {
        return pages.map((p) => (`${LsCommand.formatTime(p.frontmatter.date)}   ${p.title}`));
      } else {
        return pages.map((p) => (p.title)).join(" ");
      }
    }
  }

  private static formatTime(timeStr: string): string {
    return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
  }

}