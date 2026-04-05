import { defineConfig } from 'bunup';

export default defineConfig({
	entry: ['src/index.ts', 'src/runner.ts'],
	format: ['esm'],
	dts: true,
	clean: true,
});
