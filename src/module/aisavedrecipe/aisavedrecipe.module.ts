import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AisavedrecipeController } from 'src/controller/aisavedrecipe/aisavedrecipe.controller';
import { AisavedrecipeService } from 'src/service/aisavedrecipe/aisavedrecipe.service';
import { AiSavedRecipeRepository } from 'src/repository/aisavedrecipe/aisavedrecipe.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AisavedrecipeController],
  providers: [AisavedrecipeService, AiSavedRecipeRepository],
  exports: [AisavedrecipeService]
})
export class AisavedrecipeModule {;}
