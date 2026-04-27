import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OllamaController } from './ollama.controller';
import { OllamaService } from './ollama.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const raw =
          config.get<string>('OLLAMA_BASE_URL') ?? 'http://127.0.0.1:11434';
        const baseURL = raw.replace(/\/+$/, '');
        const timeout = Number(config.get('OLLAMA_TIMEOUT_MS') ?? 60_000);
        return {
          baseURL,
          timeout,
          maxRedirects: 3,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [OllamaController],
  providers: [OllamaService],
  exports: [OllamaService],
})
export class OllamaModule {}
