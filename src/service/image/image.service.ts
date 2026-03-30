import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ImageService {
  async getFoodImage(query: string): Promise<string> {
    try {
      const res = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query: query + " food", // 음식 키워드 보정
            per_page: 10,
          },
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
          },
        }
      );

      const results = res.data.results;

      // 결과 없으면 fallback
      if (!results || results.length === 0) {
        return `https://source.unsplash.com/800x600/?food`;
      }

      const randomIndex = Math.floor(Math.random() * results.length);

      return results[randomIndex].urls.regular;

    } catch (e) {
      console.error("Unsplash error:", e.message);

      // API 실패 시 fallback
      return `https://source.unsplash.com/800x600/?food`;
    }
  }
}