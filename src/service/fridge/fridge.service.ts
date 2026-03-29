import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFridgeDto, UpdateFridgeDto } from "src/domain/fridge/dto/fridge.dto";
import { OpenaiService } from "../openai/openai.service";

@Injectable()
export class FridgeService {
  constructor(
   private prisma: PrismaService,
   private readonly openaiService: OpenaiService,
  ) {}

async create(dto: CreateFridgeDto) {
  const {
    memberId,
    ingredientName,
    category,
    quantity,
    unit,
    expireDate
  } = dto;

  // 1. ingredient 찾기 or 생성
  let ingredient = await this.prisma.ingredient.findFirst({
    where: { ingredientName }
  });

  if (!ingredient) {
    ingredient = await this.prisma.ingredient.create({
      data: {
        ingredientName,
        ingredientCategory: category || "기타", // 🔥 안전 처리
      }
    });
  }

  // 2. 날짜 처리 (🔥 중요)
  const parsedDate = expireDate ? new Date(expireDate) : null;

  // 3. 기존 데이터 확인
  const existing = await this.prisma.myFridge.findFirst({
    where: {
      memberId,
      ingredientId: ingredient.id,
      expireDate: parsedDate
    }
  });

  if (existing) {
    return await this.prisma.myFridge.update({
      where: { id: existing.id },
      data: {
        fridgeQuantity: existing.fridgeQuantity + quantity
      }
    });
  }

  // 4. 생성
  return await this.prisma.myFridge.create({
    data: {
      memberId,
      ingredientId: ingredient.id,
      fridgeQuantity: quantity,
      unit: unit || "ea",
      expireDate: parsedDate
    }
  });
}

  async findAll(memberId: number) {
  const data = await this.prisma.myFridge.findMany({
    where: { memberId },
    include: {
      ingredient: true
    }
  });

  // group by ingredientId
  const grouped = data.reduce((acc, item) => {
    const key = item.ingredientId;

    if (!acc[key]) {
      acc[key] = {
        ingredientId: item.ingredientId,
        ingredientName: item.ingredient.ingredientName,
        category: item.ingredient.ingredientCategory,
        unit: item.unit,
        totalQuantity: 0,
        items: []
      };
    }

    acc[key].totalQuantity += item.fridgeQuantity;

    acc[key].items.push({
      id: item.id,
      quantity: item.fridgeQuantity,
      expireDate: item.expireDate
    });

    return acc;
  }, {} as any);

  return Object.values(grouped);
}


// 수정
async update(id: number, dto: UpdateFridgeDto) {
  const { quantity, unit, expireDate } = dto;

  return await this.prisma.myFridge.update({
    where: { id },
    data: {
      ...(quantity !== undefined && { fridgeQuantity: quantity }),
      ...(unit && { unit }),
      ...(expireDate && { expireDate: new Date(expireDate) })
    }
  });
}





// 삭제
async remove(id: number) {
  return await this.prisma.myFridge.delete({
    where: { id }
  });
}



// 냉장고 데이터를 openai 연결
async recommendRecipe(memberId: number) {
  const fridgeItems = await this.prisma.myFridge.findMany({
    where: { memberId },
    include: {
      ingredient: true,
    },
  });

  const ingredients = fridgeItems.map(
    item => item.ingredient.ingredientName
  );

  return this.openaiService.getRecipe(ingredients);
}




}