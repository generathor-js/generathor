#!/usr/bin/env node

import {Generator} from './generator';
import {Configuration} from './configuration';
import args from 'args';

args
  .option('config', 'Load the configuration from a file', 'generathor.config.js')
  .option('templates', 'Specify templates to process')
  .example('generathor -c ./path/to/config.js', 'Specify configuration file path')
  .example('generathor -t template_one', 'Specifying some template to process')
  .example('generathor -t "template_one template_two"', 'Specifying templates to process');

const flags = args.parse(process.argv);
const configuration = Configuration.load(flags.c);
(new Generator(configuration.sources, configuration.templates))
  .generate(flags.t)
  .then(() => {
    console.log('End process');
  })
  .catch(console.error)
  .finally(process.exit);
