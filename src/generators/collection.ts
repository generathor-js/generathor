import { File } from '../helpers/file';
import { Item } from '../sources/source';

type GeneratorForCollectionOptions = {
  template: string;
  file: string;
  source: string;
  prepareItems?: (items: Item[]) => Item[];
};

export class GeneratorForCollection {
  public constructor(private $options: GeneratorForCollectionOptions) {}

  public source(): string {
    return this.$options.source;
  }

  public template(): string {
    return this.$options.template;
  }

  public file(): string {
    return this.$options.file;
  }

  public prepareItems(items: Item[]) {
    return this.$options.prepareItems
      ? this.$options.prepareItems(items)
      : items;
  }

  public directory() {
    return File.directory(this.file());
  }
}
