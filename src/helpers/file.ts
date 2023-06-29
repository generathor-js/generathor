import path from 'path';
import fs from 'fs';

export class File {
  public static directoryExists(directory: string) {
    return fs.existsSync(directory);
  }

  public static read(file: string) {
    return fs.readFileSync(file, 'utf-8');
  }

  public static directory(file: string) {
    return path.dirname(file);
  }

  public static completePath(directory: string, file: string) {
    return `${directory}${path.sep}${file}`;
  }

  public static write(file: string, content: string) {
    if (!File.isAbsolute(file)) {
      file = File.toAbsolute(file);
    }
    File.createDirectoryIfNotExists(File.directory(file));
    fs.writeFileSync(file, content);
    console.log(`File created: ${file}`);
  }

  public static createDirectory(directory: string) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Directory created: ${directory}`);
  }

  public static isAbsolute(file: string) {
    return path.isAbsolute(file);
  }

  public static toAbsolute(file: string) {
    return path.resolve(file);
  }

  public static createDirectoryIfNotExists(directory: string) {
    if (!File.isAbsolute(directory)) {
      directory = File.toAbsolute(directory);
    }
    if (!File.directoryExists(directory)) {
      File.createDirectory(directory);
    }
  }
}

