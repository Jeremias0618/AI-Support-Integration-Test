import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type ApiRootStatus = {
  status: 'healthy';
  service: string;
  version: string;
  timestamp: string;
};

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getRootStatus(): ApiRootStatus {
    const now = new Date();
    return {
      status: 'healthy',
      service:
        this.config.get<string>('API_SERVICE_NAME') ??
        'ai-support-integration-api',
      version: this.config.get<string>('API_VERSION') ?? '0.0.1',
      timestamp: now.toISOString(),
    };
  }
}
