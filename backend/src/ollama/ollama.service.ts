import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OllamaService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private tagsPath(): string {
    const p = this.config.get<string>('OLLAMA_TAGS_PATH', '/tags') ?? '/tags';
    return p.startsWith('/') ? p : `/${p}`;
  }

  /** Lista modelos locales expuestos por Ollama (GET /tags o equivalente). */
  async getTags(): Promise<unknown> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<unknown>(this.tagsPath()),
      );
      return data;
    } catch (e) {
      const err = e as AxiosError;
      const detail = err.response?.data ?? err.message ?? 'Error desconocido';
      const base = (
        this.config.get<string>('OLLAMA_BASE_URL') ?? 'http://127.0.0.1:11434'
      ).replace(/\/+$/, '');
      throw new ServiceUnavailableException({
        message: 'No se pudo alcanzar el servidor Ollama',
        detail: typeof detail === 'string' ? detail : JSON.stringify(detail),
        baseUrl: base,
        path: this.tagsPath(),
      });
    }
  }
}
