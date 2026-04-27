import { Body, Controller, Get, Post } from '@nestjs/common';
import type { ChatRequestBody } from './ollama.dto';
import { OllamaService } from './ollama.service';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollama: OllamaService) {}

  @Get('tags')
  getTags() {
    return this.ollama.getTags();
  }

  @Post('chat')
  chat(@Body() body: ChatRequestBody) {
    return this.ollama.chat(body);
  }
}
