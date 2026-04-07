// 저징 레시피 생성
export class CreateAiSavedRecipeDTO {
  memberId: number
  title: string
  description?: string
  imageUrl?: string

  cookTime?: number
  difficulty?: string
  category?: string
  xp?: number

  ingredients: {
    main: string[]
    sub: string[]
  }

  steps: string[]
}

// 저장한 레시피 목록 응답
export class AiSavedRecipeListResponseDTO {
  id: number
  title: string
  description?: string
  imageUrl?: string

  cookTime?: number
  difficulty?: string
  category?: string
  xp?: number

  createdAt: Date
}

// 저장한 레시피 응답
export class AiSavedRecipeResponseDTO {
  id: number
  title: string
  description?: string
  imageUrl?: string

  cookTime?: number
  difficulty?: string
  category?: string
  xp?: number

  ingredients: {
    main: string[]
    sub: string[]
  }

  steps: string[]
  createdAt: Date
}