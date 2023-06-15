import {File} from '../helpers/file';

type GeneratorForItemOptions = {
  template: string;
  directory: string;
  source: string;
  fileName: (item: Record<string, any>) => string;
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

  public directory() {
    return this.$options.directory;
  }

  public fileName(item) {
    return this.$options.fileName(item);
  }
}
