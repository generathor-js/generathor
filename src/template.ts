import {File} from './file';

type TemplateForItemOptions = {
  template: string;
  directory: string;
  source: string;
  fileName: (item: Record<string, any>) => string;
};

type TemplateForItemGroupOptions = {
  template: string;
  file: string;
  source: string;
};

export class TemplateForItem {
  public constructor(
    private $options: TemplateForItemOptions
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

export class TemplateForItemGroup {
  public constructor(
    private $options: TemplateForItemGroupOptions
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
