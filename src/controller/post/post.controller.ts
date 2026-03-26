import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PostCreateDTO, PostUpdatedDTO } from 'src/domain/post/dto/post.dto';
import { PostService } from 'src/service/post/post.service';

@Controller('posts') // /posts
export class PostController {
  // 생성자 주입
  constructor(private readonly postService: PostService){;}

  // 게시글 전체 조회
  @ApiOperation({summary: "게시글 전체 조회"})
  @HttpCode(200)
  @Get("") 
  async getPosts() {
    return await this.postService.getPosts()
  }

  // 게시글 단일 조회
  @ApiOperation({summary: "게시글 단일 조회"})
  @HttpCode(200)
  @Get(":id") // /posts/:id
  async getPost(@Param("id") id: string) {
    return await this.postService.getPost(Number(id))
  }

  // 게시글 생성
  @ApiOperation({summary: "게시글 생성"})
  @HttpCode(201)
  @Post("")
  async create(@Body() postCreateDTO: PostCreateDTO) {
    await this.postService.createPost(postCreateDTO)
  }

  // 게시글 수정
  @ApiOperation({summary: "게시글 수정"})
  @HttpCode(200)
  @Put(":id") 
  async update(@Param("id") id: string, @Body() postUpdatedDTO: PostUpdatedDTO) {
    postUpdatedDTO.id = Number(id)
    await this.postService.updatePost(postUpdatedDTO)
  }

  // 게시글 삭제
  @ApiOperation({summary: "게시글 삭제"})
  @HttpCode(200)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.postService.deletePost(Number(id))
  }

}
