import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });

  async getRecipe(ingredients: string[]) {
    const prompt = `
    다음 재료를 사용해서 만들 수 있는 요리 레시피를 추천해줘.
    
    재료:
    ${ingredients.join(', ')}

    형식:
    1. 요리 이름
    2. 필요한 추가 재료
    3. 조리 방법 (단계별)
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    return response.choices[0].message.content;
  }
}