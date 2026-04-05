export type AllTypes =
	| null
	| undefined
	| boolean
	| number
	| string
	| { [key: string]: AllTypes }
	| Array<AllTypes>;

export type Item = Record<string, AllTypes>;

export abstract class Source {
	protected itemsList: Array<Item> = [];
	public abstract load(): Promise<void>;
	public abstract get items(): Array<Item>;
}
