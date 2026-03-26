import { NotFoundException } from "@nestjs/common";

// 게시글 커스텀 예외 생성
export default class PostException extends NotFoundException {
  constructor(message: string){
    super(message)
  } 
}