import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFridgeDto,
  UpdateFridgeDto,
} from 'src/domain/fridge/dto/fridge.dto';
import { OpenaiService } from '../openai/openai.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class FridgeService {
  constructor(
    private prisma: PrismaService,
    private readonly openaiService: OpenaiService,
    private readonly imageService: ImageService,
  ) {}

  // =========================
  // 생성
  // =========================
  async create(dto: CreateFridgeDto) {
    const { memberId, ingredientName, category, quantity, unit, expireDate } =
      dto;

    let ingredient = await this.prisma.ingredient.findFirst({
      where: { ingredientName },
    });

    if (!ingredient) {
      ingredient = await this.prisma.ingredient.create({
        data: {
          ingredientName,
          ingredientCategory: category || '기타',
        },
      });
    }

    const parsedDate = expireDate ? new Date(expireDate) : null;

    const existing = await this.prisma.myFridge.findFirst({
      where: {
        memberId,
        ingredientId: ingredient.id,
        expireDate: parsedDate,
      },
    });

    if (existing) {
      return await this.prisma.myFridge.update({
        where: { id: existing.id },
        data: {
          fridgeQuantity: existing.fridgeQuantity + quantity,
        },
      });
    }

    return await this.prisma.myFridge.create({
      data: {
        memberId,
        ingredientId: ingredient.id,
        fridgeQuantity: quantity,
        unit: unit || 'ea',
        expireDate: parsedDate,
      },
    });
  }

  // =========================
  // 조회
  // =========================
  async findAll(memberId: number) {
    const data = await this.prisma.myFridge.findMany({
      where: { memberId },
      include: {
        ingredient: true,
      },
    });

    const grouped = data.reduce((acc, item) => {
      const key = item.ingredientId;

      if (!acc[key]) {
        acc[key] = {
          ingredientId: item.ingredientId,
          ingredientName: item.ingredient.ingredientName,
          category: item.ingredient.ingredientCategory,
          unit: item.unit,
          totalQuantity: 0,
          items: [],
        };
      }

      acc[key].totalQuantity += item.fridgeQuantity;

      acc[key].items.push({
        id: item.id,
        quantity: item.fridgeQuantity,
        expireDate: item.expireDate,
      });

      return acc;
    }, {} as any);

    return Object.values(grouped);
  }

  // =========================
  // 수정
  // =========================
  async update(id: number, dto: UpdateFridgeDto) {
    const { quantity, unit, expireDate } = dto;

    return await this.prisma.myFridge.update({
      where: { id },
      data: {
        ...(quantity !== undefined && { fridgeQuantity: quantity }),
        ...(unit && { unit }),
        ...(expireDate && { expireDate: new Date(expireDate) }),
      },
    });
  }

  // =========================
  // 삭제
  // =========================
  async remove(id: number) {
    return await this.prisma.myFridge.delete({
      where: { id },
    });
  }

  // =========================
  // 🔥 추천 (최종 완성)
  // =========================
  async recommendRecipe(memberId: number) {
    const getRandomIngredients = (items: any[], count: number) => {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    const fridgeItems = await this.prisma.myFridge.findMany({
      where: { memberId },
      include: { ingredient: true },
    });

    // 랜덤 3개 선택
    const randomItems = getRandomIngredients(
      fridgeItems,
      Math.min(3, fridgeItems.length),
    );

    // 선택된 것만 사용
    const ingredients = randomItems.map((item) => ({
      name: item.ingredient.ingredientName,
      category: item.ingredient.ingredientCategory,
    }));

    // =========================
    // 1. OpenAI 호출
    // =========================
    const aiResponse = await this.openaiService.getRecipe(
      ingredients.map((i) => i.name),
    );

    if (!aiResponse) {
      return {
        title: '추천 요리',
        ingredients: [],
        recipe: '레시피를 생성할 수 없습니다.',
        image: '',
        steps: [],
        stepImages: [],
      };
    }

    // =========================
    // 2. JSON 파싱
    // =========================
    let parsed;

    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      parsed = {
        title: '추천 요리',
        ingredients: [],
        recipe: aiResponse,
      };
    }

    const recipeText = parsed.recipe || '';
    const ingredientList =
      (parsed.ingredients || []).length > 0
        ? parsed.ingredients.map((name: string) => {
            const found = ingredients.find((i) => name.includes(i.name));

            return {
              name,
              category: found?.category || '기타',
            };
          })
        : ingredients;

    // =========================
    // 3. 대표 이미지
    // =========================
    const image = await this.imageService.getFoodImage(
      'korean food ' + parsed.title,
    );

    // =========================
    // 4. Step 분리
    // =========================
    const steps = recipeText.split(/\d+\.\s/).filter((s) => s.trim() !== '');

    // =========================
    // 5. GPT로 step 키워드 생성
    // =========================
    const keywords = await this.openaiService.getStepKeywords(steps);

    // =========================
    // 6. step 이미지 생성
    // =========================
    const stepImages = await Promise.all(
      keywords.map((keyword) =>
        this.imageService.getFoodImage(`${keyword} food`),
      ),
    );

    // =========================
    // 7. fallback 처리
    // =========================
    while (stepImages.length < steps.length) {
      stepImages.push(image);
    }

    // =========================
    // 8. 최종 반환
    // =========================
    return {
      title: parsed.title,
      ingredients: ingredientList,
      recipe: recipeText,
      image,
      steps,
      stepImages,
    };
  }
}
