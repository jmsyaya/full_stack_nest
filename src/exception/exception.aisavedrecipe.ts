import { NotFoundException } from "@nestjs/common";

export default class AiSavedRecipeException extends NotFoundException {
  constructor(message: string){
    super(message)
  }
}