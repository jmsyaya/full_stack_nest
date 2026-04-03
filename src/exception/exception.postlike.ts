import { BadRequestException } from "@nestjs/common";

// 좋아요 커스텀 예외 생성
export default class PostLikeException extends BadRequestException {
  constructor(message: string){
    super(message)
  }
}