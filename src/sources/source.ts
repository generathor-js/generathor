type AllTypes =
  | null
  | undefined
  | boolean
  | number
  | string
  | { [key: string]: AllTypes }
  | AllTypes[];
export type Item = Record<string, AllTypes>;
export abstract class Source {
  protected $items: Item[] = [];
  public abstract load(): Promise<void>;
  public abstract items(): Item[];
}
