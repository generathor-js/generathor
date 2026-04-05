import ejs, { type TemplateFunction } from 'ejs';
import { GeneratorForCollection, type GeneratorForItem } from './generators/index.ts';
import {
	ensureDirectoryExists,
	fileExists,
	joinPath,
	readFile,
	writeFile,
} from './helpers/file.ts';
import type { Source } from './sources/index.ts';

type Generator = GeneratorForCollection | GeneratorForItem;

export class GeneratorEngine {
	constructor(
		private readonly sources: Record<string, Source>,
		private readonly generators: Record<string, Generator>,
	) {}

	public async generate(targetGeneratorNames?: string): Promise<void> {
		const executionTargets = this.resolveExecutionTargets(targetGeneratorNames);
		await this.ensureOutputDirectories(executionTargets.generators);
		await this.loadDataSources(executionTargets.sources);
		await this.executeGenerators(executionTargets.generators);
	}

	private loadDataSources(sources: Array<string>): Promise<Array<void>> {
		return Promise.all(sources.map((source) => (this.sources[source] as Source).load()));
	}

	private executeGenerators(generators: Array<string>): Promise<Array<void>> {
		return Promise.all(generators.map((generator) => this.processGenerator(generator)));
	}

	private async processGenerator(generator: string): Promise<void> {
		const generatorObject = this.generators[generator] as Generator;
		const source = this.sources[generatorObject.source] as Source;

		if (generatorObject instanceof GeneratorForCollection) {
			await this.executeCollectionGenerator(generatorObject, source);
			return;
		}

		await this.executeItemGenerator(generatorObject, source);
	}

	private async executeCollectionGenerator(
		generator: GeneratorForCollection,
		source: Source,
	): Promise<void> {
		const file = generator.file;
		if ((await fileExists(file)) && !generator.overwriteFiles) {
			return;
		}
		const templateHandler = await this.compile(generator.template);
		const output = templateHandler(generator.prepareItems(source.items));
		await writeFile(file, output);
	}

	private async compile(file: string): Promise<TemplateFunction> {
		const content = await readFile(file);
		return ejs.compile(content);
	}

	private async executeItemGenerator(generator: GeneratorForItem, source: Source): Promise<void> {
		const templateHandler = await this.compile(generator.template);
		const items = generator.prepareItems(source.items);
		const overwriteFiles = generator.overwriteFiles;

		await Promise.all(
			items.map(async (item) => {
				const file = joinPath(generator.directory, generator.fileName(item));
				if ((await fileExists(file)) && !overwriteFiles) {
					return;
				}
				const output = templateHandler(item);
				await writeFile(file, output);
			}),
		);
	}

	private async ensureOutputDirectories(generators: Array<string>): Promise<Array<void>> {
		return await Promise.all(
			generators.map((generator) =>
				ensureDirectoryExists((this.generators[generator] as Generator).directory),
			),
		);
	}

	private resolveExecutionTargets(targetGeneratorNames?: string): {
		generators: Array<string>;
		sources: Array<string>;
	} {
		const generatorsToProcess =
			targetGeneratorNames === undefined
				? Object.keys(this.generators)
				: targetGeneratorNames.split(' ');
		const requiredSources: Record<string, boolean> = {};

		for (const generator of generatorsToProcess) {
			if (!this.generators[generator]) {
				throw new Error(`Generators "${generator}" is not defined.`);
			}
			requiredSources[this.generators[generator].source] = true;
		}

		for (const source in requiredSources) {
			if (!this.sources[source]) {
				throw new Error(`Source "${source}" is not defined.`);
			}
		}

		return {
			generators: generatorsToProcess,
			sources: Object.keys(requiredSources),
		};
	}
}
