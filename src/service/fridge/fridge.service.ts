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
  // 🔴 테스트 유저 생성을 위한 함수 추가
  // =========================
  async ensureMember(memberId: number) {
    let member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      member = await this.prisma.member.create({
        data: {
          id: memberId,
          memberEmail: `test${memberId}@test.com`,
          memberName: `테스트유저${memberId}`,
        },
      });
    }

    return member;
  }

  // =========================
  // 생성
  // =========================
  async create(dto: CreateFridgeDto) {
    const { memberId, ingredientName, category, quantity, unit, expireDate } =
      dto;

    // 🔴 테스트 유저 JWT 완성되면 밑에 한 줄 삭제
    await this.ensureMember(memberId);

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
    // 🔴 테스트 유저 JWT 완성되면 밑에 한 줄 삭제
    await this.ensureMember(memberId);

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
  // 추천 (최종 완성)
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

    // 주재료만 필터링
    const mainCandidates = fridgeItems.filter((item) =>
      ['육류', '해산물', '채소'].includes(item.ingredient.ingredientCategory),
    );

    // 랜덤 3개 선택
    const randomItems = getRandomIngredients(
      mainCandidates,
      Math.min(3, mainCandidates.length),
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
    let ingredientList: any[] = [];

    if (parsed.ingredients && parsed.ingredients.length > 0) {
      ingredientList = parsed.ingredients.map((item: any) => {
        // GPT가 이상하게 줄 경우 대비
        if (typeof item === 'string') {
          return {
            name: item,
            category: '기타',
          };
        }

        return {
          name: item.name,
          category: item.category || '기타',
        };
      });
    } else {
      ingredientList = ingredients;
    }

    // GPT가 재료 누락했으면 강제로 추가
    ingredients.forEach((i) => {
      if (!ingredientList.some((item) => item.name.includes(i.name))) {
        ingredientList.push(i);
      }
    });

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
