import { Module } from '@nestjs/common';
import { MemberModule } from './module/member/member.module';
import { CoreModule } from './module/core/core.module';
import { AuthModule } from './module/auth/auth.module';
import { PostModule } from './module/post/post.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { FridgeModule } from './module/fridge/fridge.module';
import { OpenaiModule } from './module/openai/openai.module';
import { ImageService } from './service/image/image.service';
import { PostlikeController } from './controller/postlike/postlike.controller';
import { PostlikeService } from './service/postlike/postlike.service';
import { PostlikeModule } from './module/postlike/postlike.module';
import { PostLikeRepository } from './repository/postlike/postlike.repository';
import { AisavedrecipeService } from './service/aisavedrecipe/aisavedrecipe.service';
import { AisavedrecipeController } from './controller/aisavedrecipe/aisavedrecipe.controller';
import { AisavedrecipeModule } from './module/aisavedrecipe/aisavedrecipe.module';

@Module({
  imports: [
    CoreModule,
    MemberModule,
    AuthModule,
    PostModule,
    PrismaModule,
    FridgeModule,
    OpenaiModule,
    PostlikeModule,
    AisavedrecipeModule
  ],
  controllers: [PostlikeController, AisavedrecipeController],
  providers: [ImageService, PostlikeService, PostLikeRepository, AisavedrecipeService],
})
export class AppModule {}
