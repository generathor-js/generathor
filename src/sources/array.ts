import {Source, Item} from './source';

export class ArraySource extends Source {
  public constructor(items: Item[]) {
    super();
    this.$items = items;
  }

  public load() : Promise<void> {
    return Promise.resolve();
  }

  public items() : Item[] {
    return this.$items;
  }
}
