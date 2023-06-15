import {File} from './file';
export class Configuration {
  public static load(file: string): Record<string, any> {
    if (file === 'generathor.config.js') {
      file = './' + file;
    }
    if (!File.isAbsolute(file)) {
      file = File.toAbsolute(file);
    }

    return require(file);
  }
}