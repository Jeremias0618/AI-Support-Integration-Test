import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, defaultValue?: string) => {
              if (key === 'API_SERVICE_NAME') return 'test-api';
              if (key === 'API_VERSION') return '1.0.0';
              return defaultValue;
            },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API status JSON', () => {
      const body = appController.getRoot();
      expect(body.status).toBe('healthy');
      expect(body.service).toBe('test-api');
      expect(body.version).toBe('1.0.0');
      expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
