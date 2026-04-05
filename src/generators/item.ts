import type { Item } from '../sources/index.ts';

type GeneratorForItemOptions = {
	template: string;
	directory: string;
	source: string;
	overwriteFiles?: boolean;
	prepareItems?: (items: Array<Item>) => Array<Item>;
	fileName: (item: Item) => string;
};

export class GeneratorForItem {
	public constructor(private readonly options: GeneratorForItemOptions) {}

	public get source(): string {
		return this.options.source;
	}

	public get overwriteFiles(): boolean {
		return this.options.overwriteFiles ?? true;
	}

	public get template(): string {
		return this.options.template;
	}

	public prepareItems(items: Array<Item>): Array<Item> {
		return this.options.prepareItems ? this.options.prepareItems(items) : items;
	}

	public get directory(): string {
		return this.options.directory;
	}

	public fileName(item: Item): string {
		return this.options.fileName(item);
	}
}
