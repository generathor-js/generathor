import { getDirectory } from '../helpers/file.ts';
import type { Item } from '../sources/index.ts';

type GeneratorForCollectionOptions = {
	template: string;
	file: string;
	source: string;
	overwriteFiles?: boolean;
	prepareItems?: (items: Array<Item>) => Array<Item>;
};

export class GeneratorForCollection {
	public constructor(private readonly options: GeneratorForCollectionOptions) {}

	public get source(): string {
		return this.options.source;
	}

	public get overwriteFiles(): boolean {
		return this.options.overwriteFiles ?? true;
	}

	public get template(): string {
		return this.options.template;
	}

	public get file(): string {
		return this.options.file;
	}

	public prepareItems(items: Array<Item>): Array<Item> {
		return this.options.prepareItems ? this.options.prepareItems(items) : items;
	}

	public get directory(): string {
		return getDirectory(this.file);
	}
}
