import fs from 'fs';
import path from 'path';

export const FileHandler = {
  readJsonFile: (fileName) => {
    const filePath = path.resolve('tests', 'resources', `${fileName}.json`);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      throw new Error(`Failed to read or parse file: ${filePath}\n${err}`);
    }
  }
};
