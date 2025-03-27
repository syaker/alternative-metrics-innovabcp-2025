import { Injectable } from '@nestjs/common';

import { version } from '../../../package.json';

@Injectable()
export class VersionService {
  async getVersionInfo() {
    return version;
  }
}
