import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PostLikeDTO } from 'src/domain/postlike/dto/postlike.dto';
import { PostlikeService } from 'src/service/postlike/postlike.service';

@Controller('postlike')
export class PostlikeController {
  constructor(private readonly postLikeService: PostlikeService) {}

  // 좋아요 생성
  @ApiOperation({ summary: '좋아요 생성' })
  @HttpCode(201)
  @Post()
  async create(@Body() postLikeCreateDTO: PostLikeDTO) {
    return this.postLikeService.createPostLike(postLikeCreateDTO);
  }

  // 좋아요 삭제
  @ApiOperation({ summary: '좋아요 삭제' })
  @HttpCode(200)
  @Delete()
  async delete(@Body() postLikeDeletedDTO: PostLikeDTO) {
    return this.postLikeService.deletePostLike(postLikeDeletedDTO);
  }
}
