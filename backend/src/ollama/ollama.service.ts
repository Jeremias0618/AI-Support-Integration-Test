import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import type { ChatRequestBody } from './ollama.dto';

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

  /** Envía mensajes a Ollama `/api/chat` (sin streaming). */
  async chat(body: ChatRequestBody): Promise<{ reply: string; model?: string }> {
    const trimmed = body.message?.trim();
    if (!trimmed) {
      throw new BadRequestException('El campo "message" es obligatorio');
    }

    const model =
      this.config.get<string>('OLLAMA_DEFAULT_MODEL') ?? 'llama3.2';
    const systemPrompt =
      this.config.get<string>('OLLAMA_SYSTEM_PROMPT') ??
      'Eres un asistente de soporte técnico amable y conciso. Responde en español salvo que el usuario escriba en otro idioma.';

    const history = (body.history ?? [])
      .filter(
        (m) =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0,
      )
      .slice(-30)
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: trimmed },
    ];

    const chatTimeout = Number(
      this.config.get('OLLAMA_CHAT_TIMEOUT_MS') ?? 120_000,
    );

    try {
      const { data } = await firstValueFrom(
        this.http.post<{
          message?: { role: string; content: string };
          model?: string;
        }>(
          '/api/chat',
          { model, messages, stream: false },
          { timeout: chatTimeout },
        ),
      );
      const reply = data.message?.content ?? '';
      return { reply, model: data.model };
    } catch (e) {
      const err = e as AxiosError;
      const detail = err.response?.data ?? err.message ?? 'Error desconocido';
      const base = (
        this.config.get<string>('OLLAMA_BASE_URL') ?? 'http://127.0.0.1:11434'
      ).replace(/\/+$/, '');
      throw new ServiceUnavailableException({
        message: 'Ollama no respondió al chat',
        detail: typeof detail === 'string' ? detail : JSON.stringify(detail),
        baseUrl: base,
        path: '/api/chat',
      });
    }
  }
}
