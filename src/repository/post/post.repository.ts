import { Injectable } from "@nestjs/common";
import { PostCreateDTO, PostDTO } from "src/domain/auth/dto/post/post.dto";
import { PrismaService } from "src/service/prisma/prisma.service";

@Injectable()
export class PostRepository {
  // Prisma  접근
  constructor(private readonly prisma: PrismaService) {;}

  // 게시글 목록 전체 조회
  async findPosts() {
    const foundPosts: PostDTO[] = await this.prisma.post.findMany({
      include: {
        member: {
          select: {
            id: true,
            memberName: true
          },
        },
        recipe: {
          select: {
            id: true,
            recipeTitle: true,
          }
        }
      },
    });

    return foundPosts;
  }

  // 게시글 단일 조회

  // 게시글 추가
  async save(postCreateDTO: PostCreateDTO): Promise<void> {
    await this.prisma.post.create({
      data: postCreateDTO
    })
  }

  // 게시글 수정
  // 게시글 삭제


}