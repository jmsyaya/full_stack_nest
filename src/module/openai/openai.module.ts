import { Module } from '@nestjs/common';
import { OpenaiService } from 'src/service/openai/openai.service';

@Module({
  providers: [OpenaiService],
  exports: [OpenaiService], // ⭐ 이거 반드시 있어야 함
})
export class OpenaiModule {}