export type Item = Record<string, any>;

export abstract class Source {
  protected $items: Item[] = [];
  public abstract load() : Promise<void>;
  public abstract items() : Item[];
}
