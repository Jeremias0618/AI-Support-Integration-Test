import { Controller, Get } from '@nestjs/common';
import { OllamaService } from './ollama.service';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollama: OllamaService) {}

  @Get('tags')
  getTags() {
    return this.ollama.getTags();
  }
}
