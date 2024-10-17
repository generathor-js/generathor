import { File } from './file';
import { GeneratorForCollection, GeneratorForItem } from '../generators';
import { Source } from '../sources';
type Generator = GeneratorForCollection | GeneratorForItem;
type ConfigurationParams = {
  sources: Record<string, Source>;
  generators: Record<string, Generator>;
};

export class Configuration {
  public static load(file: string): ConfigurationParams {
    if (file === 'generathor.config.js') {
      file = './' + file;
    }
    if (!File.isAbsolute(file)) {
      file = File.toAbsolute(file);
    }

    return require(file) as ConfigurationParams;
  }
}
