import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });

  // =========================
  // 레시피 생성 (유지)
  // =========================
  async getRecipe(ingredients: string[]): Promise<string> {
    const prompt = `
다음 재료를 반드시 모두 포함해서 요리를 만들어라:

${ingredients.map((i) => `- ${i}`).join('\n')}

🔥 규칙:
1. 위 재료는 반드시 전부 사용해야 한다
2. 각 재료는 아래 형식으로 반환해야 한다:
   { "name": "재료명", "category": "육류/해산물/채소/기타" }
3. category는 반드시 정확히 지정해야 한다
4. 임의로 재료를 제거하거나 바꾸지 마라

반드시 JSON 형식으로만 응답:

{
  "title": "요리 이름",
  "ingredients": [
    { "name": "재료명", "category": "채소" }
  ],
  "recipe": "1. ... 2. ... 3. ..."
}
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content?.match(/\{[\s\S]*\}/);

    return jsonMatch ? jsonMatch[0] : content || '';
  }

  // =========================
  // Step 키워드 생성 (완전 개선)
  // =========================
  async getStepKeywords(steps: string[]): Promise<string[]> {
    const prompt = `
다음 요리 단계들을 보고 각각에 맞는 "음식 이미지 검색 키워드"를 만들어줘.

🔥 매우 중요:
- 반드시 영어
- 2~4 단어
- 음식 + 행동 포함 (예: "frying pork", "cutting onion", "kimchi fried rice")
- 결과 음식이나 재료가 반드시 포함되어야 함 (핵심!)
- 절대 일반 단어 금지 (예: cooking, food ❌)
- 서로 다른 키워드로 생성

예시:
["frying pork belly", "chopping onion", "kimchi fried rice", "plating dish"]

steps:
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

반드시 JSON 배열로만 답변:
["keyword1", "keyword2", "keyword3"]
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // 안정성 + 다양성 균형
    });

    const content = response.choices[0].message.content;
    const match = content?.match(/\[[\s\S]*\]/);

    let keywords: string[] = [];

    try {
      keywords = match ? JSON.parse(match[0]) : [];
    } catch {
      keywords = [];
    }

    // =========================
    // 중복 제거
    // =========================
    const uniqueKeywords = Array.from(new Set(keywords));

    // =========================
    // fallback 개선 (중요)
    // =========================
    const fallbackKeywords = [
      'korean food cooking',
      'stir fry korean food',
      'fried rice cooking',
      'korean dish plating',
      'home cooking meal',
    ];

    let i = 0;
    while (uniqueKeywords.length < steps.length) {
      uniqueKeywords.push(fallbackKeywords[i % fallbackKeywords.length]);
      i++;
    }

    // =========================
    // 길이 맞추기
    // =========================
    return uniqueKeywords.slice(0, steps.length);
  }
}
