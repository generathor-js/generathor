import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';

export async function readFile(file: string): Promise<string> {
	return await fs.readFile(file, 'utf-8');
}

export async function fileExists(file: string): Promise<boolean> {
	try {
		await fs.access(file);
		return true;
	} catch {
		return false;
	}
}

export function getDirectory(file: string): string {
	return path.dirname(file);
}

export function joinPath(directory: string, file: string): string {
	return `${directory}${path.sep}${file}`;
}

export async function writeFile(file: string, content: string): Promise<void> {
	if (!isAbsolutePath(file)) {
		file = getAbsolutePath(file);
	}
	await ensureDirectoryExists(getDirectory(file));
	await fs.writeFile(file, content);
	console.log(`${pc.gray('│')}  File created: ${file}`);
}

export async function createDirectory(directory: string): Promise<void> {
	await fs.mkdir(directory, { recursive: true });
}

export function isAbsolutePath(file: string): boolean {
	return path.isAbsolute(file);
}

export function getAbsolutePath(file: string): string {
	return path.resolve(file);
}

export async function ensureDirectoryExists(directory: string): Promise<void> {
	if (!isAbsolutePath(directory)) {
		directory = getAbsolutePath(directory);
	}
	if (!(await fileExists(directory))) {
		await createDirectory(directory);
	}
}
