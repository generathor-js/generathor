import {File} from '../helpers/file';

type GeneratorForCollectionOptions = {
  template: string;
  file: string;
  source: string;
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

  public directory() {
    return File.directory(this.file());
  }
}
