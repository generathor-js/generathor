#!/usr/bin/env node

import * as p from '@clack/prompts';
import args from 'args';
import pc from 'picocolors';
import { loadConfig } from './helpers/configuration.ts';
import { GeneratorEngine } from './manager.ts';

type CliOptions = {
	c?: string;
	g?: string;
};

args
	.option('config', 'Load the configuration from a file', 'generathor.config.js')
	.option('generators', 'Specify generators to process')
	.example('generathor -c ./path/to/config.js', 'Specify configuration file path')
	.example('generathor -g generator_one', 'Specifying some generator to process')
	.example('generathor -g "generator_one generator_two"', 'Specifying generators to process');

const cliOptions: CliOptions = args.parse(process.argv);
const configuration = await loadConfig(cliOptions.c ?? 'generathor.config.js');

p.intro(pc.bgCyan(pc.black(' Generathor ')));

const availableGenerators = Object.keys(configuration.generators);
if (availableGenerators.length === 0) {
	p.log.warn('No generators found in configuration.');
	process.exit(0);
}

let targetGeneratorNames: string | undefined = cliOptions.g;

if (targetGeneratorNames === undefined) {
	const selected = await p.multiselect({
		message: 'Select generators to run (press Enter for all)',
		options: availableGenerators.map((g) => ({ value: g, label: g })),
		required: false,
	});

	if (p.isCancel(selected)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const selectedGenerators = selected;
	targetGeneratorNames =
		selectedGenerators.length === 0 ? availableGenerators.join(' ') : selectedGenerators.join(' ');
}

const s = p.spinner();
s.start('Generating files...');

try {
	await new GeneratorEngine(configuration.sources, configuration.generators).generate(
		targetGeneratorNames,
	);
	s.stop('Files generated successfully!');
	p.outro(pc.green('Process completed.'));
} catch (err) {
	s.stop('An error occurred during generation.');
	p.log.error(err instanceof Error ? err.message : String(err));
	p.outro(pc.red('Process failed.'));
} finally {
	process.exit(0);
}
