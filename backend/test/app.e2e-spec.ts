import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.status).toBe('healthy');
        expect(typeof res.body.service).toBe('string');
        expect(typeof res.body.version).toBe('string');
        expect(res.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
