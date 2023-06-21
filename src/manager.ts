import {File} from './helpers/file';
import {GeneratorForCollection, GeneratorForItem} from './generators';
import {Source} from './sources';
import {default as handlebars} from 'handlebars';
type Generator = GeneratorForCollection | GeneratorForItem;

export class Manager {
  constructor(
    private sources: Record<string, Source>,
    private generators: Record<string, Generator>,
  ) {}

  public async generate(generators?: string) {
    const processInput = this.processInput(generators);
    this.createDirectories(processInput.generators);
    await this.loadSources(processInput.sources);
    await this.processGenerators(processInput.generators);
  }

  private loadSources(sources: string[]) {
    const ps = [];
    for (const source of sources) {
      ps.push(this.sources[source].load());
    }

    return Promise.all(ps);
  }

  private processGenerators(generators: string[]) {
    const ps = [];
    for (const generator of generators) {
      ps.push(this.processGenerator(generator));
    }

    return Promise.all(ps);
  }

  private async processGenerator(generator: string) {
    const generatorObject = this.generators[generator];
    const source = this.sources[generatorObject.source()];

    if (generatorObject instanceof GeneratorForCollection) {
      return this.processGeneratorForCollection(generatorObject, source);
    }

    return this.processGeneratorForItem(generatorObject, source)
  }

  private processGeneratorForCollection(generator: GeneratorForCollection, source: Source) {
    const templateHandler = this.compile(generator.template());
    const output = templateHandler(
      generator.prepareItems(
        source.items()
      )
    );
    File.write(
      generator.file(),
      output
    );
  }

  private compile(file: string) {
    return handlebars.compile(
      File.read(file)
    );
  }

  private processGeneratorForItem(generator: GeneratorForItem, source: Source) {
    const templateHandler = this.compile(generator.template());
    const items = generator.prepareItems(source.items());
    for (const item of items) {
      const output = templateHandler(item);
      File.write(
        File.completePath(
          generator.directory(),
          generator.fileName(item)
        ),
        output
      );
    }
  }

  private createDirectories(generators: string[]) {
    for (const generator of generators) {
      File.createDirectoryIfNotExists(this.generators[generator].directory());
    }
  }

  private processInput(generators?: string) {
    const generatorsToProcess = generators ? generators.split(' ') : Object.keys(this.generators);
    const requiredSources: Record<string, boolean> = {};

    for (const generator of generatorsToProcess) {
      if (!this.generators[generator]) {
        throw new Error(`Generators "${generator}" is not defined.`);
      }
      requiredSources[this.generators[generator].source()] = true;
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


