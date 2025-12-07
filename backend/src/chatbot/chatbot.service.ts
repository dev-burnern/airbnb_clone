import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../listings/listing.entity';

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
}

@Injectable()
export class ChatbotService {
  private readonly ollamaBaseUrl = 'http://ollama:11434';
  private readonly model = 'airbnb-bot';

  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

  /**
   * 실제 DB에서 숙소 데이터 조회
   */
  async getListingsData(): Promise<string> {
    try {
      const listings = await this.listingRepository.find({
        take: 50, // 최대 50개
        order: { createdAt: 'DESC' },
        select: [
          'id',
          'title',
          'description',
          'type',
          'address',
          'amenities',
          'maxGuests',
          'basePrice',
          'weekendPrice',
        ]
      });

      console.log(`📊 DB에서 ${listings.length}개 숙소 조회됨`);

      if (listings.length === 0) {
        return '현재 등록된 숙소가 없습니다. 데이터베이스가 비어있습니다.';
      }

      // 숙소 데이터를 AI가 이해하기 쉬운 텍스트로 변환
      const listingsText = listings.map((listing, index) => {
        return `
[숙소 ${index + 1}]
ID: ${listing.id}
제목: ${listing.title}
설명: ${listing.description}
주소: ${listing.address}
타입: ${listing.type}
기본 가격: ${listing.basePrice.toLocaleString()}원/박
주말 가격: ${listing.weekendPrice ? listing.weekendPrice.toLocaleString() + '원/박' : '기본가격과 동일'}
최대 인원: ${listing.maxGuests}명
편의시설: ${Array.isArray(listing.amenities) ? listing.amenities.join(', ') : '정보 없음'}
        `.trim();
      }).join('\n\n---\n\n');

      return listingsText;

    } catch (error) {
      console.error('❌ 숙소 데이터 조회 실패:', error);
      return '숙소 데이터를 불러오는 중 오류가 발생했습니다.';
    }
  }

  /**
   * 지역별 필터링 (선택사항)
   */
  async getListingsByLocation(location?: string): Promise<string> {
    try {
      let query = this.listingRepository
        .createQueryBuilder('listing')
        .select([
          'listing.id',
          'listing.title',
          'listing.description',
          'listing.type',
          'listing.address',
          'listing.amenities',
          'listing.maxGuests',
          'listing.basePrice',
          'listing.weekendPrice',
        ])
        .orderBy('listing.createdAt', 'DESC')
        .take(50);

      // 지역 키워드가 있으면 필터링
      if (location) {
        query = query.where('listing.address ILIKE :location', {
          location: `%${location}%`
        });
      }

      const listings = await query.getMany();

      console.log(`📊 "${location || '전체'}" 지역 ${listings.length}개 숙소 조회됨`);

      if (listings.length === 0) {
        return location 
          ? `"${location}" 지역에서 찾을 수 있는 숙소가 없습니다.`
          : '현재 등록된 숙소가 없습니다.';
      }

      const listingsText = listings.map((listing, index) => {
        return `
[숙소 ${index + 1}]
ID: ${listing.id}
제목: ${listing.title}
설명: ${listing.description}
주소: ${listing.address}
타입: ${listing.type}
기본 가격: ${listing.basePrice.toLocaleString()}원/박
주말 가격: ${listing.weekendPrice ? listing.weekendPrice.toLocaleString() + '원/박' : '기본가격과 동일'}
최대 인원: ${listing.maxGuests}명
편의시설: ${Array.isArray(listing.amenities) ? listing.amenities.join(', ') : '정보 없음'}
        `.trim();
      }).join('\n\n---\n\n');

      return listingsText;

    } catch (error) {
      console.error('❌ 지역별 숙소 조회 실패:', error);
      return '숙소 데이터를 불러오는 중 오류가 발생했습니다.';
    }
  }

  /**
   * 사용자 메시지에서 지역 키워드 추출 (간단한 버전)
   */
  private extractLocation(message: string): string | null {
    const locations = ['대구', '서울', '부산', '제주', '강남', '동성로', '중구', '수성구'];
    
    for (const loc of locations) {
      if (message.includes(loc)) {
        return loc;
      }
    }
    
    return null;
  }

  /**
   * 사용자와 히스토리를 받아 챗봇 메시지 구성
   */
  async handleChat(message: string, history: any[] = []) {
    // 메시지에서 지역 추출
    const location = this.extractLocation(message);
    
    // 숙소 데이터 가져오기 (지역 필터링 포함)
    const listingsData = location 
      ? await this.getListingsByLocation(location)
      : await this.getListingsData();

    const systemPrompt = {
      role: 'system',
      content: `
너는 에어비앤비 숙소 추천 전문 상담 챗봇이다.

아래는 현재 등록된 실제 숙소 목록이다:

${listingsData}

역할:
- 사용자의 여행 목적, 인원, 예산, 일정을 파악하여 위 숙소 중에서 가장 적합한 것을 추천한다.
- 반드시 위에 제공된 숙소 목록 데이터만 기반으로 추천한다.
- 목록에 없는 숙소, 가격, 시설을 절대 지어내지 않는다.
- 사용자 조건에 맞는 숙소가 없으면 "조건에 맞는 숙소를 찾을 수 없습니다"라고 솔직히 말한다.
- 추천할 때는 숙소 ID와 제목을 반드시 포함한다.
- 답변은 항상 한국어로 하며, 간결하고 명확하게 작성한다.
- 가격은 원 단위로 표시하고, 추가 비용이나 할인 정보가 있으면 안내한다.

제한:
- 결제, 실제 예약, 환불 정책은 "예시"로만 설명하고, 실제는 웹사이트를 확인하라고 안내한다.
- 숙소 추천과 무관한 질문에는 "이 챗봇은 숙박 추천 전문입니다"라고 답한다.
      `.trim(),
    };

    const messages = [
      systemPrompt,
      ...history.map((h) => ({
        role: h.role,
        content: h.content ?? '',
      })),
      { role: 'user', content: message },
    ];

    return await this.callOllama(messages);
  }

  /**
   * Ollama API 호출
   */
  async callOllama(messages: { role: string; content: string }[]) {
    const url = `${this.ollamaBaseUrl}/api/chat`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          stream: false,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Ollama Error:', errorText);
        throw new Error(`Ollama request failed: ${res.status} ${errorText}`);
      }

      const data = (await res.json()) as OllamaResponse;
      const answer = data?.message?.content ?? '응답 생성 실패';

      console.log('✅ Ollama Response:', {
        model: data.model,
        contentLength: answer.length,
        duration: data.total_duration ? `${(data.total_duration / 1e9).toFixed(2)}초` : 'N/A'
      });

      return { answer };

    } catch (error) {
      console.error('❌ Ollama API Error:', error);
      throw error;
    }
  }
}