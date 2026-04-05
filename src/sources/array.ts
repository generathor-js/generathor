import { type Item, Source } from './source.js';

export class ArraySource extends Source {
	public constructor(items: Array<Item>) {
		super();
		this.itemsList = items;
	}

	public load(): Promise<void> {
		return Promise.resolve();
	}

	public get items(): Array<Item> {
		return this.itemsList;
	}
}
