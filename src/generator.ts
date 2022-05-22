import {File} from './file';
import {TemplateForItemGroup, TemplateForItem} from './template';
import {Source} from './source';
import {default as handlebars} from 'handlebars';
type Template = TemplateForItemGroup | TemplateForItem;

export class Generator {
  constructor(
    private sources: Record<string, Source>,
    private templates: Record<string, Template>,
  ) {}

  public async generate(templates?: string) {
    const processInput = this.processInput(templates);
    this.createDirectories(processInput.templates);
    await this.loadSources(processInput.sources);
    await this.processTemplates(processInput.templates);
  }

  private loadSources(sources: string[]) {
    const ps = [];
    for (const source of sources) {
      ps.push(this.sources[source].load());
    }

    return Promise.all(ps);
  }

  private processTemplates(templates: string[]) {
    const ps = [];
    for (const template of templates) {
      ps.push(this.processTemplate(template));
    }

    return Promise.all(ps);
  }

  private processTemplate(template: string) {
    const templateDefinition = this.templates[template];
    const source = this.sources[templateDefinition.source()];
    if (templateDefinition instanceof TemplateForItemGroup) {
      return this.processTemplateForItemGroup(templateDefinition, source);
    }

    return this.processTemplateForItems(templateDefinition, source)
  }

  private processTemplateForItemGroup(template: TemplateForItemGroup, source: Source) {
    const templateHandler = this.compile(template.template());
    const output = templateHandler(source.items());
    File.write(
      template.file(),
      output
    );
  }

  private compile(file: string) {
    return handlebars.compile(
      File.read(file)
    );
  }

  private processTemplateForItems(template: TemplateForItem, source: Source) {
    const templateHandler = this.compile(template.template());
    for (const item of source.items()) {
      const output = templateHandler(item);
      File.write(
        File.completePath(
          template.directory(),
          template.fileName(item)
        ),
        output
      );
    }
  }

  private createDirectories(templates: string[]) {
    for (const template of templates) {
      File.createDirectoryIfNotExists(this.templates[template].directory());
    }
  }

  private processInput(templates?: string) {
    const templatesToProcess = templates ? templates.split(' ') : Object.keys(this.templates);
    const requiredSources: Record<string, boolean> = {};
    for (const template of templatesToProcess) {
      if (!this.templates[template]) {
        throw new Error(`Template "${template}" is not defined.`);
      }
      requiredSources[this.templates[template].source()] = true;
    }
    for (const source in requiredSources) {
      if (!this.sources[source]) {
        throw new Error(`Source "${source}" is not defined.`);
      }
    }

    return {
      templates: templatesToProcess,
      sources: Object.keys(requiredSources),
    }
  }
}


