#!/usr/bin/env node

import { Manager } from './manager';
import { Configuration } from './helpers/configuration';
import args from 'args';

args
  .option(
    'config',
    'Load the configuration from a file',
    'generathor.config.js'
  )
  .option('generators', 'Specify generators to process')
  .example(
    'generathor -c ./path/to/config.js',
    'Specify configuration file path'
  )
  .example(
    'generathor -g generator_one',
    'Specifying some generator to process'
  )
  .example(
    'generathor -g "generator_one generator_two"',
    'Specifying generators to process'
  );

const flags = args.parse(process.argv);
const configuration = Configuration.load(flags.c);
new Manager(configuration.sources, configuration.generators)
  .generate(flags.g)
  .then(() => {
    console.log('End process');
  })
  .catch(console.error)
  .finally(process.exit);
