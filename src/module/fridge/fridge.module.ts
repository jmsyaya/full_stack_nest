import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { OpenaiModule } from '../openai/openai.module';
import { FridgeController } from 'src/controller/fridge/fridge.controller';
import { FridgeService } from 'src/service/fridge/fridge.service';

@Module({
  imports: [OpenaiModule], 
  controllers: [FridgeController],
  providers: [FridgeService, PrismaService],
})
export class FridgeModule {}