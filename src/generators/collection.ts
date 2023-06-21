import {File} from '../helpers/file';

type Item = Record<string, any>;
type GeneratorForCollectionOptions = {
  template: string;
  file: string;
  source: string;
  prepareItems?: (items: Item[]) => Item[];
};

export class GeneratorForCollection {
  public constructor(
    private $options: GeneratorForCollectionOptions
  )
  {}

  public source() {
    return this.$options.source;
  }

  public template() {
    return this.$options.template;
  }

  public file() {
    return this.$options.file;
  }

  public prepareItems(items: Item[]) {
    return this.$options.prepareItems ? this.$options.prepareItems(items) : items;
  }

  public directory() {
    return File.directory(this.file());
  }
}
