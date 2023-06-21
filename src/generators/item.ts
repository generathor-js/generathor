type Item = Record<string, any>;
type GeneratorForItemOptions = {
  template: string;
  directory: string;
  source: string;
  prepareItems?: (items: Item[]) => Item[];
  fileName: (item: Item) => string;
};

export class GeneratorForItem {
  public constructor(
    private $options: GeneratorForItemOptions
  )
  {}

  public source() {
    return this.$options.source;
  }

  public template() {
    return this.$options.template;
  }

  public prepareItems(items: Item[]) {
    return this.$options.prepareItems ? this.$options.prepareItems(items) : items;
  }

  public directory() {
    return this.$options.directory;
  }

  public fileName(item) {
    return this.$options.fileName(item);
  }
}
