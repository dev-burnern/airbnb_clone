import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';

// 시드 실행 함수
async function runSeed() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    console.log('📦 데이터베이스 연결 완료');

    try {
        // 순서대로 시드 실행 (의존성 순서)
        await seedUsers(dataSource);
        await seedUserProfiles(dataSource);
        await seedHosts(dataSource);
        await seedProperty(dataSource);
        await seedLocations(dataSource);
        await seedRoomTypes(dataSource);
        await seedRoomOptions(dataSource);
        await seedCategories(dataSource);
        await seedRooms(dataSource);
        await seedRoomImages(dataSource);
        await seedListings(dataSource);
        await seedBookings(dataSource);
        await seedReservations(dataSource);
        await seedConversations(dataSource);
        await seedMessages(dataSource);
        await seedChatbot(dataSource);
        await seedChatbotSessions(dataSource);
        await seedChatbotLogs(dataSource);
        await seedChatMessages(dataSource);
        await seedReviews(dataSource);
        await seedWishlists(dataSource);

        console.log('✅ 모든 시드 데이터 생성 완료!');
    } catch (error) {
        console.error('❌ 시드 실행 오류:', error);
    } finally {
        await dataSource.destroy();
    }
}

// ========== 사용자 ==========
async function seedUsers(dataSource: DataSource) {
    const users = [];
    const names = ['김민수', '이영희', '박철수', '최지은', '정대현', '강서연', '윤재호', '송미래', '임준영', '한소희',
        '오승민', '배수지', '조현우', '신예린', '권도훈', '문채원', '황민호', '안지영', '유승호', '장서윤'];

    for (let i = 1; i <= 50; i++) {
        const name = names[i % names.length];
        users.push({
            email: `user${i}@example.com`,
            password: '$2b$10$abcdefghijklmnopqrstuv', // bcrypt hash
            name: `${name}${i}`,
            avatarUrl: `https://i.pravatar.cc/150?img=${i}`,
            roles: i <= 10 ? 'host,guest' : 'guest',
            provider: i % 5 === 0 ? 'github' : 'local',
            githubId: i % 5 === 0 ? `github_${i}` : null,
        });
    }

    await dataSource.query(`
        INSERT INTO users (email, password, name, "avatarUrl", roles, provider, "githubId")
        SELECT * FROM unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[])
        ON CONFLICT (email) DO NOTHING
    `, [
        users.map(u => u.email),
        users.map(u => u.password),
        users.map(u => u.name),
        users.map(u => u.avatarUrl),
        users.map(u => u.roles),
        users.map(u => u.provider),
        users.map(u => u.githubId),
    ]);
    console.log('👤 Users: 50개 생성');
}

// ========== 사용자 프로필 ==========
async function seedUserProfiles(dataSource: DataSource) {
    const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '제주'];
    const languages = ['한국어', '영어', '일본어', '중국어', '한국어, 영어'];
    const jobs = ['개발자', '디자이너', '마케터', '학생', '프리랜서', '사업가', '교사', '의사', '변호사', '요리사'];

    for (let i = 1; i <= 30; i++) {
        await dataSource.query(`
            INSERT INTO user_profile (user_id, image_name, path, introduction_text, location, language, job, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (user_id) DO NOTHING
        `, [
            i,
            `profile_${i}.jpg`,
            `/uploads/profiles/profile_${i}.jpg`,
            `안녕하세요! 여행을 좋아하는 ${jobs[i % jobs.length]}입니다.`,
            locations[i % locations.length],
            languages[i % languages.length],
            jobs[i % jobs.length],
            'active'
        ]);
    }
    console.log('📝 UserProfiles: 30개 생성');
}

// ========== 호스트 ==========
async function seedHosts(dataSource: DataSource) {
    for (let i = 1; i <= 20; i++) {
        await dataSource.query(`
            INSERT INTO hosts (host_name, identity_verified, listing_count)
            VALUES ($1, $2, $3)
        `, [
            `호스트${i}`,
            i % 3 === 0 ? 'verified' : 'pending',
            Math.floor(Math.random() * 10) + 1
        ]);
    }
    console.log('🏠 Hosts: 20개 생성');
}

// ========== 숙소 유형 ==========
async function seedProperty(dataSource: DataSource) {
    const properties = ['아파트', '주택', '빌라', '펜션', '호텔', '게스트하우스', '리조트', '캠핑장', '글램핑', '한옥'];

    for (const name of properties) {
        await dataSource.query(`
            INSERT INTO property (property_name, status)
            VALUES ($1, 'active')
        `, [name]);
    }
    console.log('🏢 Property: 10개 생성');
}

// ========== 위치 ==========
async function seedLocations(dataSource: DataSource) {
    const locationData = [
        { name: '강남구', desc: '서울의 중심 비즈니스 지구', traffic: '지하철 2호선, 신분당선', lat: 37.4979, lng: 127.0276, neighbourhood: '역삼동', group: '서울' },
        { name: '홍대입구', desc: '젊음의 거리, 예술과 문화의 중심', traffic: '지하철 2호선, 경의중앙선', lat: 37.5563, lng: 126.9237, neighbourhood: '서교동', group: '서울' },
        { name: '해운대', desc: '부산 최고의 해변 휴양지', traffic: '지하철 2호선', lat: 35.1631, lng: 129.1635, neighbourhood: '해운대동', group: '부산' },
        { name: '제주시', desc: '제주도의 중심 도시', traffic: '버스, 렌터카', lat: 33.4996, lng: 126.5312, neighbourhood: '연동', group: '제주' },
        { name: '서귀포', desc: '제주 남부의 아름다운 관광지', traffic: '버스, 렌터카', lat: 33.2541, lng: 126.5601, neighbourhood: '서귀동', group: '제주' },
        { name: '경복궁', desc: '서울의 역사적 명소', traffic: '지하철 3호선', lat: 37.5796, lng: 126.9770, neighbourhood: '세종로', group: '서울' },
        { name: '명동', desc: '쇼핑과 맛집의 천국', traffic: '지하철 4호선', lat: 37.5636, lng: 126.9869, neighbourhood: '명동', group: '서울' },
        { name: '이태원', desc: '다문화 거리, 외국인 관광 명소', traffic: '지하철 6호선', lat: 37.5347, lng: 126.9946, neighbourhood: '이태원동', group: '서울' },
        { name: '강릉', desc: '동해안 최고의 휴양지', traffic: 'KTX, 버스', lat: 37.7519, lng: 128.8761, neighbourhood: '강문동', group: '강원' },
        { name: '전주', desc: '한옥마을과 전통 문화의 도시', traffic: 'KTX, 버스', lat: 35.8242, lng: 127.1480, neighbourhood: '풍남동', group: '전북' },
        { name: '경주', desc: '천년 고도, 역사 문화 도시', traffic: 'KTX, 버스', lat: 35.8562, lng: 129.2247, neighbourhood: '황남동', group: '경북' },
        { name: '여수', desc: '아름다운 밤바다의 도시', traffic: 'KTX, 버스', lat: 34.7604, lng: 127.6622, neighbourhood: '충무동', group: '전남' },
        { name: '속초', desc: '설악산과 동해의 조화', traffic: '버스', lat: 38.2070, lng: 128.5918, neighbourhood: '조양동', group: '강원' },
        { name: '대구', desc: '패션과 음식의 도시', traffic: '지하철, KTX', lat: 35.8714, lng: 128.6014, neighbourhood: '동성로', group: '대구' },
        { name: '인천', desc: '서해안 최대의 항구 도시', traffic: '지하철, 공항철도', lat: 37.4563, lng: 126.7052, neighbourhood: '송도동', group: '인천' },
    ];

    for (const loc of locationData) {
        await dataSource.query(`
            INSERT INTO locations (location_name, description_location, description_traffic, lat, lng, neighbourhood, neighbourhood_group)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [loc.name, loc.desc, loc.traffic, loc.lat, loc.lng, loc.neighbourhood, loc.group]);
    }
    console.log('📍 Locations: 15개 생성');
}

// ========== 객실 유형 ==========
async function seedRoomTypes(dataSource: DataSource) {
    const types = ['전체', '개인실', '다인실', '호텔객실', '독채', '반려동물 동반', '수영장', '바다전망', '산전망', '시내전망'];

    for (const type of types) {
        await dataSource.query(`
            INSERT INTO room_types (types_name, status)
            VALUES ($1, 'active')
        `, [type]);
    }
    console.log('🛏️ RoomTypes: 10개 생성');
}

// ========== 객실 옵션 ==========
async function seedRoomOptions(dataSource: DataSource) {
    for (let i = 1; i <= 20; i++) {
        await dataSource.query(`
            INSERT INTO room_options (item1, item2, item3, status)
            VALUES ($1, $2, $3, 'active')
        `, [
            Math.floor(Math.random() * 5) + 1,  // 침실 수
            Math.floor(Math.random() * 3) + 1,  // 욕실 수
            Math.floor(Math.random() * 8) + 2   // 최대 인원
        ]);
    }
    console.log('⚙️ RoomOptions: 20개 생성');
}

// ========== 카테고리 ==========
async function seedCategories(dataSource: DataSource) {
    const categories = ['해변', '산', '도심', '시골', '섬', '호수', '스키', '캠핑', '디자인', '역사', '한옥', '펜트하우스', '농장', '열대', '북극'];

    for (const cat of categories) {
        await dataSource.query(`
            INSERT INTO categories (category_name, status)
            VALUES ($1, 'active')
        `, [cat]);
    }
    console.log('📂 Categories: 15개 생성');
}

// ========== 객실 ==========
async function seedRooms(dataSource: DataSource) {
    const roomNames = ['아늑한 스튜디오', '럭셔리 펜트하우스', '모던 아파트', '전통 한옥', '오션뷰 빌라',
        '마운틴뷰 하우스', '시티뷰 로프트', '가든 코티지', '비치 하우스', '포레스트 캐빈'];

    for (let i = 1; i <= 100; i++) {
        await dataSource.query(`
            INSERT INTO rooms (room_name, room_address, room_price, room_wishes, room_description, 
                             check_in_time, check_out_time, status, location_id, room_types_id, room_option_id, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
            `${roomNames[i % roomNames.length]} #${i}`,
            `서울시 강남구 테헤란로 ${i}길`,
            50000 + (Math.floor(Math.random() * 200000)),
            Math.floor(Math.random() * 500),
            `아름다운 전망과 편안한 인테리어를 갖춘 ${roomNames[i % roomNames.length]}입니다. 청결하고 쾌적한 환경에서 편안한 휴식을 즐기세요.`,
            '15:00',
            '11:00',
            'active',
            (i % 15) + 1,
            (i % 10) + 1,
            (i % 20) + 1,
            (i % 15) + 1
        ]);
    }
    console.log('🏡 Rooms: 100개 생성');
}

// ========== 객실 이미지 ==========
async function seedRoomImages(dataSource: DataSource) {
    for (let roomId = 1; roomId <= 100; roomId++) {
        const imageCount = Math.floor(Math.random() * 4) + 3; // 3~6개 이미지
        for (let j = 1; j <= imageCount; j++) {
            await dataSource.query(`
                INSERT INTO room_images (room_id, image_name, path, status)
                VALUES ($1, $2, $3, 'active')
            `, [
                roomId,
                `room_${roomId}_${j}.jpg`,
                `https://picsum.photos/800/600?random=${roomId * 10 + j}`
            ]);
        }
    }
    console.log('🖼️ RoomImages: ~400개 생성');
}

// ========== 숙소 (listings) ==========
async function seedListings(dataSource: DataSource) {
    const types = ['아파트', '주택', '빌라', '펜션', '호텔'];
    const amenities = [
        ['WiFi', '에어컨', '주방', '세탁기'],
        ['WiFi', '에어컨', '주방', '주차장', '수영장'],
        ['WiFi', '에어컨', '난방', 'TV', '헬스장'],
        ['WiFi', '에어컨', '조식', '청소서비스'],
    ];

    // 먼저 user ID들을 가져옴
    const users = await dataSource.query(`SELECT id FROM users LIMIT 10`);

    for (let i = 1; i <= 80; i++) {
        const hostId = users[(i - 1) % users.length].id;
        await dataSource.query(`
            INSERT INTO listings (title, description, type, address, latitude, longitude, images, amenities, 
                                "maxGuests", "basePrice", "weekendPrice", "smartPricingEnabled", "hostId")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
            `멋진 ${types[i % types.length]} #${i}`,
            `서울의 중심에 위치한 아늑하고 깨끗한 숙소입니다. 대중교통 접근성이 좋고, 주변에 맛집과 관광지가 많습니다.`,
            types[i % types.length],
            `서울시 강남구 역삼동 ${i}번지`,
            37.5 + (Math.random() * 0.1),
            127.0 + (Math.random() * 0.1),
            `image${i}_1.jpg,image${i}_2.jpg,image${i}_3.jpg`,
            JSON.stringify(amenities[i % amenities.length]),
            Math.floor(Math.random() * 6) + 2,
            50000 + (Math.floor(Math.random() * 150000)),
            70000 + (Math.floor(Math.random() * 180000)),
            i % 3 === 0,
            hostId
        ]);
    }
    console.log('🏘️ Listings: 80개 생성');
}

// ========== 예약 (bookings) ==========
async function seedBookings(dataSource: DataSource) {
    const users = await dataSource.query(`SELECT id FROM users`);
    const listings = await dataSource.query(`SELECT id FROM listings`);
    const statuses = ['PENDING', 'PAID', 'CONFIRMED', 'CANCELLED'];

    for (let i = 1; i <= 150; i++) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 60) - 30);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 7) + 1);

        await dataSource.query(`
            INSERT INTO bookings ("checkIn", "checkOut", "guestCount", "totalPrice", status, "guestId", "listingId")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            checkIn.toISOString().split('T')[0],
            checkOut.toISOString().split('T')[0],
            Math.floor(Math.random() * 4) + 1,
            100000 + Math.floor(Math.random() * 500000),
            statuses[i % statuses.length],
            users[(i - 1) % users.length].id,
            listings[(i - 1) % listings.length].id
        ]);
    }
    console.log('📅 Bookings: 150개 생성');
}

// ========== 예약 상세 (reservations) ==========
async function seedReservations(dataSource: DataSource) {
    for (let i = 1; i <= 100; i++) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 60));
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 5) + 1);

        await dataSource.query(`
            INSERT INTO reservation (check_in_date, check_out_date, adults, childeren, infants, pets, status, room_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            checkIn,
            checkOut,
            Math.floor(Math.random() * 4) + 1,
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 2),
            'confirmed',
            (i % 100) + 1
        ]);
    }
    console.log('📋 Reservations: 100개 생성');
}

// ========== 대화 (conversations) ==========
async function seedConversations(dataSource: DataSource) {
    const users = await dataSource.query(`SELECT id FROM users`);

    for (let i = 0; i < 50; i++) {
        const user1 = users[i % users.length].id;
        const user2 = users[(i + 1) % users.length].id;

        await dataSource.query(`
            INSERT INTO conversations (title, "participant1Id", "participant2Id", "lastMessageAt")
            VALUES ($1, $2, $3, $4)
        `, [
            `예약 문의 #${i + 1}`,
            user1,
            user2,
            new Date()
        ]);
    }
    console.log('💬 Conversations: 50개 생성');
}

// ========== 메시지 (messages) ==========
async function seedMessages(dataSource: DataSource) {
    const conversations = await dataSource.query(`SELECT id FROM conversations`);
    const users = await dataSource.query(`SELECT id FROM users`);
    const messageTemplates = [
        '안녕하세요! 예약 관련해서 문의드립니다.',
        '체크인 시간 변경이 가능할까요?',
        '네, 물론이죠! 도움이 필요하시면 말씀해주세요.',
        '감사합니다. 곧 도착할 예정입니다.',
        '숙소 위치가 정확히 어디인가요?',
        '주차 공간이 있나요?',
        '조식 포함인가요?',
        '체크아웃 시간 연장 가능한가요?',
        '반려동물 동반 가능한가요?',
        '청소 서비스는 언제 제공되나요?'
    ];

    for (const conv of conversations) {
        const msgCount = Math.floor(Math.random() * 8) + 3;
        for (let j = 0; j < msgCount; j++) {
            await dataSource.query(`
                INSERT INTO messages ("conversationId", "senderId", content, "isRead")
                VALUES ($1, $2, $3, $4)
            `, [
                conv.id,
                users[j % users.length].id,
                messageTemplates[j % messageTemplates.length],
                Math.random() > 0.3
            ]);
        }
    }
    console.log('📨 Messages: ~300개 생성');
}

// ========== 챗봇 ==========
async function seedChatbot(dataSource: DataSource) {
    const intents = ['greeting', 'booking_inquiry', 'price_inquiry', 'location_inquiry', 'amenity_inquiry', 'cancellation', 'refund', 'complaint'];

    for (let i = 1; i <= 20; i++) {
        await dataSource.query(`
            INSERT INTO chatbot (message, intent, ai_answer, ticket_id, email, status)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            `챗봇 질문 ${i}`,
            intents[i % intents.length],
            `AI 답변: 안녕하세요! 문의 #${i}에 대한 답변입니다.`,
            i,
            `user${i}@example.com`,
            'active'
        ]);
    }
    console.log('🤖 Chatbot: 20개 생성');
}

// ========== 챗봇 세션 ==========
async function seedChatbotSessions(dataSource: DataSource) {
    for (let i = 1; i <= 50; i++) {
        const startedAt = new Date();
        startedAt.setHours(startedAt.getHours() - Math.floor(Math.random() * 24));
        const endedAt = new Date(startedAt);
        endedAt.setMinutes(endedAt.getMinutes() + Math.floor(Math.random() * 30) + 5);

        await dataSource.query(`
            INSERT INTO chatbot_session (started_at, ended_at, status, chatbot_id, user_id)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            startedAt,
            endedAt,
            'completed',
            (i % 20) + 1,
            (i % 50) + 1
        ]);
    }
    console.log('🔄 ChatbotSessions: 50개 생성');
}

// ========== 챗봇 로그 ==========
async function seedChatbotLogs(dataSource: DataSource) {
    for (let i = 1; i <= 100; i++) {
        await dataSource.query(`
            INSERT INTO chatbot_logs (request_text, response_text, response_status, response_time, chatbot_id, session_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            `사용자 요청 ${i}`,
            `AI 응답 ${i}`,
            'success',
            Math.random() * 2,
            (i % 20) + 1,
            (i % 50) + 1
        ]);
    }
    console.log('📊 ChatbotLogs: 100개 생성');
}

// ========== 챗 메시지 ==========
async function seedChatMessages(dataSource: DataSource) {
    const messageTypes = ['user', 'bot', 'system'];

    for (let i = 1; i <= 200; i++) {
        await dataSource.query(`
            INSERT INTO chat_messages (message_text, message_type, is_read, status, session_id, chatbot_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            `챗 메시지 내용 ${i}`,
            messageTypes[i % messageTypes.length],
            Math.random() > 0.2,
            'active',
            (i % 50) + 1,
            (i % 20) + 1
        ]);
    }
    console.log('💭 ChatMessages: 200개 생성');
}

// ========== 리뷰 ==========
async function seedReviews(dataSource: DataSource) {
    const reviewTexts = [
        '정말 깨끗하고 아늑한 숙소였습니다. 호스트분도 친절하셔서 좋았어요!',
        '위치가 좋고 교통이 편리해서 여행하기 좋았습니다.',
        '전망이 너무 예뻤어요. 다음에 또 방문하고 싶습니다.',
        '예상보다 더 넓고 쾌적했습니다. 강력 추천합니다!',
        '가격 대비 훌륭한 숙소입니다. 만족스러웠어요.',
        '조용하고 편안하게 쉴 수 있었습니다.',
        '청결하고 침구가 편안했어요.',
        '호스트의 응대가 빠르고 친절했습니다.',
        '주변에 맛집이 많아서 좋았어요.',
        '체크인/체크아웃이 간편해서 좋았습니다.'
    ];

    for (let i = 1; i <= 200; i++) {
        await dataSource.query(`
            INSERT INTO reviews (content_text, status, star_point, room_id, user_id)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            reviewTexts[i % reviewTexts.length],
            'approved',
            Math.floor(Math.random() * 2) + 4, // 4~5점
            (i % 100) + 1,
            (i % 50) + 1
        ]);
    }
    console.log('⭐ Reviews: 200개 생성');
}

// ========== 위시리스트 ==========
async function seedWishlists(dataSource: DataSource) {
    const users = await dataSource.query(`SELECT id FROM users`);
    const listings = await dataSource.query(`SELECT id FROM listings`);
    const wishlistNames = ['제주 여행', '서울 출장', '부산 휴가', '강원도 스키', '가족 여행', '친구들과 여행', '힐링 여행', '맛집 탐방'];

    for (let i = 0; i < 40; i++) {
        const userId = users[i % users.length].id;

        // 위시리스트 생성
        const result = await dataSource.query(`
            INSERT INTO wishlists (name, "userId")
            VALUES ($1, $2)
            RETURNING id
        `, [
            wishlistNames[i % wishlistNames.length],
            userId
        ]);

        // 위시리스트에 숙소 추가 (3~7개)
        const listingCount = Math.floor(Math.random() * 5) + 3;
        for (let j = 0; j < listingCount; j++) {
            const listingId = listings[(i * 3 + j) % listings.length].id;
            await dataSource.query(`
                INSERT INTO wishlists_listings_listing ("wishlistsId", "listingId")
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
            `, [result[0].id, listingId]);
        }
    }
    console.log('❤️ Wishlists: 40개 생성 (200+ 연결)');
}

// 실행
runSeed();
