import { Item } from '../sources/source';

type GeneratorForItemOptions = {
  template: string;
  directory: string;
  source: string;
  prepareItems?: (items: Item[]) => Item[];
  fileName: (item: Item) => string;
};

export class GeneratorForItem {
  public constructor(private $options: GeneratorForItemOptions) {}

  public source(): string {
    return this.$options.source;
  }

  public template(): string {
    return this.$options.template;
  }

  public prepareItems(items: Item[]) {
    return this.$options.prepareItems
      ? this.$options.prepareItems(items)
      : items;
  }

  public directory(): string {
    return this.$options.directory;
  }

  public fileName(item: Item): string {
    return this.$options.fileName(item);
  }
}
