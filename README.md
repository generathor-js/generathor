![Generathor Logo](https://cldup.com/U-06c9VkSH.png)

# Generathor

Generathor is a tool to create files based on different sources.

# Why use Generathor?

When you create multiple files based on something you can make some mistakes. So, the best way to create those files is to find a way to create them automatically.

# How does it work?

There are two things to keep in mind for Generathor to work: **Sources** and **Templates**.

## Sources

We use sources to load data. To create new ways to load data, you need to create a class that extends our base Source class.

```js
const { Source } = require("generathor");

class DBSource extends Source {
  constructor() {
    super();
  }

  async load() {
    //Code here
  }

  items() {
    return this.$items;
  }

}
``` 

## Templates

In order to create one file or one group of files you need to specify one template, and you can set more than one template to process.
You need to associate the template with some source, and create the template file using [handlebars](https://handlebarsjs.com/). 

# Using Generathor

1. Installation
    ```bash
    $ npm i -D generathor
    ```
    
2. Create **generathor.config.js** in root path
    ```js
    const path = require('path');
    const { ArraySource, TemplateForItem, TemplateForItemGroup } = require('generathor');

    module.exports = {
      sources: {
        db: new ArraySource([
          {
            table: 'table_1',
            columns: ['id', 'name'],
          },
          {
            table: 'table_2',
            columns: ['id', 'status'],
          }
        ])
      },
      templates: {
        models: new TemplateForItemGroup({
          template: './templates/export-models.handlebars',
          source: 'db',
          file: './result/index.js',
        }),
        'export-models': new TemplateForItem({
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

3. Run the script
    ```bash
    $ generathor
    ```
    To check more options run:
    ```bash
    $ generathor --help
    ```

# Ecosystem

TBD