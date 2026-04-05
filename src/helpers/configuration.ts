import { pathToFileURL } from 'node:url';
import type { GeneratorForCollection, GeneratorForItem } from '../generators/index.ts';
import type { Source } from '../sources/index.ts';
import { getAbsolutePath, isAbsolutePath } from './file.ts';

type Generator = GeneratorForCollection | GeneratorForItem;
export type GenerathorConfig = {
	sources: Record<string, Source>;
	generators: Record<string, Generator>;
};
type ImportedConfigModule = {
	default?: GenerathorConfig;
} & GenerathorConfig;

export async function loadConfig(file: string): Promise<GenerathorConfig> {
	if (file === 'generathor.config.js') {
		file = `./${file}`;
	}
	if (!isAbsolutePath(file)) {
		file = getAbsolutePath(file);
	}

	const fileUrl: string = pathToFileURL(file).href;
	const configModule = (await import(fileUrl)) as ImportedConfigModule;

	return configModule.default ?? configModule;
}
