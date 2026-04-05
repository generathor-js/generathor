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

# ⚡ Generathor

**Generathor** is a flexible and simple file generator. It automates the process of creating multiple files from a single data source, keeping your codebase standardized and preventing manual copy-paste errors.

---

## 🚀 Quick Start in 3 Steps

### 1. Install Generathor
Install it as a dev dependency in your project:
```bash
npm i -D generathor
```

### 2. Configure your Generators
Create a `generathor.config.js` file at the root of your project. This file tells Generathor **where to get data** (Sources) and **how to generate files** (Generators).

Generathor uses [EJS (Embedded JavaScript)](https://ejs.co/) for templates.

```js
const path = require('path');
const { ArraySource, GeneratorForItem, GeneratorForCollection } = require('generathor');

module.exports = {
  // 📥 Sources: Where your data comes from
  sources: {
    db: new ArraySource([
      { table: 'users', columns: ['id', 'name', 'email'] },
      { table: 'posts', columns: ['id', 'title', 'content'] },
    ]),
  },
  
  // 📤 Generators: How your files will be built
  generators: {
    // Generates ONE file combining all data from the source
    exportModels: new GeneratorForCollection({
      template: './templates/export.ejs',
      source: 'db',
      file: './output/index.js',
      overwriteFiles: true,
    }),
    
    // Generates MULTIPLE files (one per item in the source)
    models: new GeneratorForItem({
      template: path.resolve('./templates/model.ejs'),
      source: 'db',
      directory: path.resolve('./output'),
      fileName: (item) => `${item.table}.js`,
      overwriteFiles: true,
    }),
  },
};
```

### 3. Run the CLI
Execute Generathor from your terminal. It will automatically detect your config file and map the sources to your templates.
```bash
npx generathor
```
You can also run specific generators directly:
```bash
npx generathor -g "models exportModels"
```

---

## 🧩 Core Concepts

Generathor is built around two simple concepts:

### 1️⃣ Sources (`ArraySource` | `CustomSource`)
Sources act as the data provider. The built-in `ArraySource` takes a simple JSON array. Need to fetch data from an API or database? Just extend the base `Source` class!

```ts
import { Source } from 'generathor';

class CustomApiSource extends Source {
  public async load(): Promise<void> {
    const data = await fetch('https://api.example.com/data');
    this.itemsList = await data.json();
  }
}
```

### 2️⃣ Generators
Generators combine the **data items** from your source with your **EJS templates** to output files!

#### `GeneratorForCollection`
Takes all the data from the source and passes it as an array to your template. Perfect for generating `index.ts` export files or centralized registries.

| Option | Required | Description |
|---|---|---|
| `template` | ✅ Required | Path to the `.ejs` template file. |
| `source` | ✅ Required | Name of the source key to pull data from. |
| `file` | ✅ Required | Output file path for the generated file. |
| `overwriteFiles` | ⬜ Optional | Whether to overwrite if the file already exists. Defaults to `true`. |
| `prepareItems` | ⬜ Optional | Callback to transform the items before passing them to the template. |

#### `GeneratorForItem`
Iterates over every single item in your source and passes it individually to your template. Ideal for generating individual Models, Controllers, or Components.

| Option | Required | Description |
|---|---|---|
| `template` | ✅ Required | Path to the `.ejs` template file. |
| `source` | ✅ Required | Name of the source key to pull data from. |
| `directory` | ✅ Required | Output directory where files will be written. |
| `fileName` | ✅ Required | Function that returns the file name for each item: `(item) => string`. |
| `overwriteFiles` | ⬜ Optional | Whether to overwrite if the file already exists. Defaults to `true`. |
| `prepareItems` | ⬜ Optional | Callback to transform the items before passing them to the template. |

---

## ✨ Other Features

### Data Transformations (`prepareItems`)
You can transform data before it hits the template without modifying the original source using the `prepareItems` callback:

```js
new GeneratorForItem({
  // ...
  prepareItems(items) {
    return items.map(item => ({
      ...item,
      // Create a capitalized class name for the template to use
      className: item.table.charAt(0).toUpperCase() + item.table.slice(1)
    }));
  }
});
```

## 🌍 Ecosystem
Explore related packages to power up your generathor workflows:
- [generathor-db](https://www.npmjs.com/package/generathor-db)
- [generathor-laravel](https://www.npmjs.com/package/generathor-laravel)