<p align="center">
  <img src="https://cldup.com/U-06c9VkSH.png" alt="Generathor">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/generathor">
    <img src="https://img.shields.io/npm/v/generathor.svg" alt="NPM">
  </a>
  <a href="https://npmcharts.com/compare/generathor?minimal=true">
    <img src="https://img.shields.io/npm/dt/generathor.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/generathor">
    <img src="https://img.shields.io/npm/l/generathor.svg" alt="License">
  </a>
</p>

# Generathor

**Generathor** helps you automatically generate files from various data sources using templates. It saves time and prevents manual errors in repetitive tasks.

## Why use Generathor?

Manual file creation can lead to mistakes. Generathor automates this process, ensuring accuracy and speeding up the workflow.

## How does it work?

Generathor is built around two main components: **Sources** and **Generators**.

### Sources

Sources provide the data for generating files. You can create custom sources by extending the `Source` class.

```ts
import { Source } from 'generathor';

class CustomSource extends Source {
  constructor() {
    super();
  }

  public async load(): Promise<void> {
    this.$items = await this.fetchData(); // Load your data here
  }

  public items(): Item[] {
    return this.$items;
  }
}
```

### Generators

Generators use the data from sources to create files using [handlebars](https://handlebarsjs.com/) templates. There are two types:

- **GeneratorForCollection**: Creates one file for a collection of items.
- **GeneratorForItem**: Creates individual files for each item.

#### Example for GeneratorForCollection:

```ts
new GeneratorForCollection({
  template: './template.handlebars',
  source: 'custom',
  file: './output.csv',
  prepareItems(items) {
    return items.map(item => ({
      ...item,
      transformed: item.name.toUpperCase(), // Example transformation
    }));
  }
});
```

#### Configuration

| Variable       | Required | Description                                                            |
|----------------|----------|------------------------------------------------------------------------|
| `template`     | `Yes`    | The template to use.                                                   |
| `source`       | `Yes`    | The source to use to load the items.                                   |
| `file`         | `Yes`    | The file to write the output to.                                       |
| `prepareItems` | `No`     | Callback to modify the items before using them to generate the output. |

This will generate a single file (`collection.txt`) for all the items in your source.

#### Example for GeneratorForItem:

```ts
new GeneratorForItem({
  template: './templates/item.handlebars',
  source: 'custom',
  directory: './output/items',
  fileName(item) {
    return `${item.id}.txt`;
  },
  prepareItems(items) {
    return items.map(item => ({
      ...item,
      transformed: item.name.toUpperCase(), // Example transformation
    }));
  }
});
```

#### Configuration

| Variable       | Required | Description                                                            |
|----------------|----------|------------------------------------------------------------------------|
| `template`     | `Yes`    | The template to use.                                                   |
| `directory`    | `Yes`    | The directory to write the output to.                                  |
| `source`       | `Yes`    | The source to use to load the items.                                   |
| `fileName`     | `Yes`    | Callback to get the file name for each item.                           |
| `prepareItems` | `No`     | Callback to modify the items before using them to generate the output. |

This will create one file per item in the source (e.g., `1.txt`, `2.txt`, etc.).

## How to use Generathor

1. **Install** Generathor:
   ```bash
   $ npm i -D generathor
   ```

2. **Configure** by creating a `generathor.config.js` file at your project root:
   ```js
   const path = require('path');
   const { ArraySource, GeneratorForItem, GeneratorForCollection } = require('generathor');

   module.exports = {
     sources: {
       db: new ArraySource([
         { table: 'table_1', columns: ['id', 'name'] },
         { table: 'table_2', columns: ['id', 'status'] },
       ]),
     },
     templates: {
       models: new GeneratorForCollection({
         template: './templates/export-models.handlebars',
         source: 'db',
         file: './result/index.js',
       }),
       'export-models': new GeneratorForItem({
         template: path.resolve('./templates/model.handlebars'),
         source: 'db',
         directory: path.resolve('./result'),
         fileName(item) {
           return item.table + '.js';
         },
       }),
     },
   };
   ```

3. **Run**:
   ```bash
   $ generathor
   ```

   To see more options:
   ```bash
   $ generathor --help
   ```

## Ecosystem

Explore related packages:

- [generathor-db](https://www.npmjs.com/package/generathor-db)
- [generathor-laravel](https://www.npmjs.com/package/generathor-laravel)

## TODO

- [ ] Add objection js generators - WIP
- [ ] Add support for the overwriteFiles configuration option.
- [ ] Add more sources (API, CSV, etc.)