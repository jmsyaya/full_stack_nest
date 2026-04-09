import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAiSavedRecipeDTO } from 'src/domain/aisavedrecipe/dto/aisavedrecipe.dto';
import AiSavedRecipeException from 'src/exception/exception.aisavedrecipe';
import { AisavedrecipeService } from 'src/service/aisavedrecipe/aisavedrecipe.service';

@Controller('aisavedrecipe')
export class AisavedrecipeController {
  constructor(private readonly aisavedrecipeService: AisavedrecipeService) {}

  // 저장
  @ApiOperation({ summary: 'AI 저장 레시피 생성' })
  @HttpCode(201)
  @Post()
  async create(@Body() createAiSavedRecipeDTO: CreateAiSavedRecipeDTO) {
    return await this.aisavedrecipeService.createAiSavedRecipe({
      ...createAiSavedRecipeDTO,
      memberId: 2,
    }); // memberId 집어넣은 이유는 jwt 인증 안해서 임시로 넣음
  }

  // 회원별 목록 전체 조회
  @ApiOperation({ summary: '회원별 AI 저장 레시피 목록 조회' })
  @HttpCode(200)
  @Get('/member/:memberId')
  async findAllByMemberId(@Param('memberId') memberId: string) {
    return await this.aisavedrecipeService.getAiSavedRecipeList(
      Number(memberId),
    );
  }

  // 상세 조회
  @ApiOperation({ summary: 'AI 저장 레시피 상세 조회' })
  @HttpCode(200)
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return await this.aisavedrecipeService.getAiSavedRecipeDetail(Number(id));
  }

  // 삭제
  @ApiOperation({ summary: 'AI 저장 레시피 삭제' })
  @HttpCode(200)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.aisavedrecipeService.deleteAiSavedRecipe(Number(id));
  }
}
