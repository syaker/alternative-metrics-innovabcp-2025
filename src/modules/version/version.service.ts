import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import simpleGit from 'simple-git';

@Injectable()
export class VersionService {
  private readonly packageJsonPath = 'package.json';
  private readonly git = simpleGit();

  async getVersionInfo() {
    const packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf8'));
    const version = packageJson.version;

    const hash = await this.git.revparse(['HEAD']);
    return { version: `${version}#${hash}` };
  }
}
