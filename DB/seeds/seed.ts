import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import * as bcrypt from 'bcryptjs';

// 시드 실행 함수
async function runSeed() {
    // 환경변수로 DB 연결 정보 오버라이드 (도커 환경용)
    const baseOptions = dataSourceOptions as any;
    const dbOptions = {
        ...baseOptions,
        host: process.env.DB_HOST || baseOptions.host || 'localhost',
        port: parseInt(process.env.DB_PORT || String(baseOptions.port) || '5432', 10),
        username: process.env.DB_USERNAME || baseOptions.username || 'airbnb',
        password: process.env.DB_PASSWORD || baseOptions.password || 'airbnb',
        database: process.env.DB_DATABASE || baseOptions.database || 'airbnb',
        synchronize: false, // 기존 스키마 사용
    };
    
    const dataSource = new DataSource(dbOptions);
    await dataSource.initialize();
    console.log('📦 데이터베이스 연결 완료:', dbOptions.host, dbOptions.port, dbOptions.database);

    try {
        // 순서대로 시드 실행 (의존성 순서)
        // 순서대로 시드 실행 (의존성 순서) - UUID 반환 및 전달
        await seedUsers(dataSource);
        await seedUserProfiles(dataSource);
        await seedHosts(dataSource);
        await seedProperty(dataSource);

        const locationIds = await seedLocations(dataSource);
        const roomTypeIds = await seedRoomTypes(dataSource);
        const roomOptionIds = await seedRoomOptions(dataSource);
        const categoryIds = await seedCategories(dataSource);

        const roomIds = await seedRooms(dataSource, locationIds, roomTypeIds, roomOptionIds, categoryIds);
        await seedRoomImages(dataSource, roomIds);
        await seedListings(dataSource);

        await seedBookings(dataSource);
        await seedReservations(dataSource, roomIds);
        await seedConversations(dataSource);
        await seedMessages(dataSource);
        await seedChatbot(dataSource);
        await seedChatbotSessions(dataSource);
        await seedChatbotLogs(dataSource);
        await seedChatMessages(dataSource);
        await seedReviews(dataSource);
        await seedWishlists(dataSource);

        console.log('✅ 전체 시드 데이터 생성 완료!');
    } catch (error) {
        console.error('❌ 시드 실행 오류:', error);
    } finally {
        await dataSource.destroy();
    }
}

// ========== 사용자 ==========
async function seedUsers(dataSource: DataSource) {
    const users = [];
    const names = ['김민수', '이영희', '박철수', '최지은', '정대현', '강서연', '윤재호'];

    // 비밀번호 통일: 123456
    const hashedPassword = await bcrypt.hash('123456', 10);

    for (let i = 1; i <= 7; i++) {
        const name = names[i - 1];
        users.push({
            email: `user${i}@example.com`,
            password: hashedPassword,
            name: name,
            avatarUrl: `https://i.pravatar.cc/150?img=${i}`,
            roles: 'host,guest', // 모든 유저가 호스트 가능
            provider: 'local',
            githubId: null,
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
    console.log('👤 Users: 7명 생성 (패스워드: 123456)');
}

// ========== 사용자 프로필 ==========
async function seedUserProfiles(dataSource: DataSource) {
    const locations = ['서울', '부산', '대구', '제주', '일본', '미국', '필리핀'];
    const languages = ['한국어', '영어', '일본어', '중국어', '한국어, 영어'];
    const jobs = ['개발자', '디자이너', '마케터', '학생', '프리랜서', '사업가', '교사'];

    // 실제 user ID (UUID) 조회
    const users = await dataSource.query(`SELECT id FROM users ORDER BY "createdAt" LIMIT 7`);

    const profileImages = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'
    ];

    for (let i = 0; i < users.length; i++) {
        await dataSource.query(`
            INSERT INTO user_profile (user_id, image_name, path, introduction_text, location, language, job, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (user_id) DO NOTHING
        `, [
            users[i].id,
            `profile_${i + 1}.jpg`,
            profileImages[i % profileImages.length],
            `안녕하세요! 여행을 좋아하는 ${jobs[i % jobs.length]}입니다.`,
            locations[i % locations.length],
            languages[i % languages.length],
            jobs[i % jobs.length],
            'active'
        ]);
    }
    console.log('📝 UserProfiles: 7개 생성');
}


// ========== 호스트 ==========
async function seedHosts(dataSource: DataSource) {
    for (let i = 1; i <= 7; i++) {
        await dataSource.query(`
            INSERT INTO hosts (host_name, identity_verified, listing_count)
            VALUES ($1, $2, $3)
        `, [
            `호스트${i}`,
            'verified',
            70 // 70 listings
        ]);
    }
    console.log('🏠 Hosts: 7개 생성');
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
        { name: '대구', desc: '패션과 음식의 도시', traffic: '지하철, KTX', lat: 35.8714, lng: 128.6014, neighbourhood: '동성로', group: '대구' },
        { name: '부산', desc: '항구 도시', traffic: '지하철, KTX', lat: 35.1796, lng: 129.0756, neighbourhood: '해운대', group: '부산' },
        { name: '서울', desc: '대한민국의 수도', traffic: '지하철, 버스', lat: 37.5665, lng: 126.9780, neighbourhood: '강남', group: '서울' },
        { name: '제주', desc: '아름다운 섬', traffic: '공항', lat: 33.4996, lng: 126.5312, neighbourhood: '제주시', group: '제주' },
        { name: '일본', desc: '가깝고도 먼 나라', traffic: '항공', lat: 35.6762, lng: 139.6503, neighbourhood: '도쿄', group: '해외' },
        { name: '미국', desc: '자유의 나라', traffic: '항공', lat: 40.7128, lng: -74.0060, neighbourhood: '뉴욕', group: '해외' },
        { name: '필리핀', desc: '휴양의 천국', traffic: '항공', lat: 14.5995, lng: 120.9842, neighbourhood: '마닐라', group: '해외' },
    ];

    const createdIds = [];
    for (const loc of locationData) {
        const res = await dataSource.query(`
            INSERT INTO locations (location_name, description_location, description_traffic, lat, lng, neighbourhood, neighbourhood_group)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING location_id
        `, [loc.name, loc.desc, loc.traffic, loc.lat, loc.lng, loc.neighbourhood, loc.group]);
        createdIds.push(res[0].location_id);
    }
    console.log(`📍 Locations: ${createdIds.length}개 생성 (UUID)`);
    return createdIds;
}

// ========== 객실 유형 ==========
async function seedRoomTypes(dataSource: DataSource) {
    const types = ['전체', '개인실', '다인실', '호텔객실', '독채', '반려동물 동반', '수영장', '바다전망', '산전망', '시내전망'];
    const createdIds = [];

    for (const type of types) {
        const res = await dataSource.query(`
            INSERT INTO room_types (types_name, status)
            VALUES ($1, 'active')
            RETURNING room_types_id
        `, [type]);
        createdIds.push(res[0].room_types_id);
    }
    console.log(`🛏️ RoomTypes: ${createdIds.length}개 생성 (UUID)`);
    return createdIds;
}

// ========== 객실 옵션 ==========
async function seedRoomOptions(dataSource: DataSource) {
    const createdIds = [];
    for (let i = 1; i <= 20; i++) {
        const res = await dataSource.query(`
            INSERT INTO room_options (item1, item2, item3, status)
            VALUES ($1, $2, $3, 'active')
            RETURNING room_option_id
        `, [
            Math.floor(Math.random() * 5) + 1,  // 침실 수
            Math.floor(Math.random() * 3) + 1,  // 욕실 수
            Math.floor(Math.random() * 8) + 2   // 최대 인원
        ]);
        createdIds.push(res[0].room_option_id);
    }
    console.log(`⚙️ RoomOptions: ${createdIds.length}개 생성 (UUID)`);
    return createdIds;
}

// ========== 카테고리 ==========
async function seedCategories(dataSource: DataSource) {
    const categories = ['해변', '산', '도심', '시골', '섬', '호수', '스키', '캠핑', '디자인', '역사', '한옥', '펜트하우스', '농장', '열대', '북극'];
    const createdIds = [];

    for (const cat of categories) {
        const res = await dataSource.query(`
            INSERT INTO categories (category_name, status)
            VALUES ($1, 'active')
            RETURNING category_id
        `, [cat]);
        createdIds.push(res[0].category_id);
    }
    console.log(`📂 Categories: ${createdIds.length}개 생성 (UUID)`);
    return createdIds;
}

// ========== 객실 ==========
// ========== 객실 ==========
async function seedRooms(dataSource: DataSource, locationIds: string[], roomTypeIds: string[], roomOptionIds: string[], categoryIds: string[]) {
    const roomNames = ['아늑한 스튜디오', '럭셔리 펜트하우스', '모던 아파트', '전통 한옥', '오션뷰 빌라',
        '마운틴뷰 하우스', '시티뷰 로프트', '가든 코티지', '비치 하우스', '포레스트 캐빈'];

    const createdIds = [];

    for (let i = 1; i <= 100; i++) {
        const res = await dataSource.query(`
            INSERT INTO rooms (room_name, room_address, room_price, room_wishes, room_description, 
                             check_in_time, check_out_time, status, location_id, room_types_id, room_option_id, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING room_id
        `, [
            `${roomNames[i % roomNames.length]} #${i}`,
            `서울시 강남구 테헤란로 ${i}길`,
            50000 + (Math.floor(Math.random() * 200000)),
            Math.floor(Math.random() * 500),
            `아름다운 전망과 편안한 인테리어를 갖춘 ${roomNames[i % roomNames.length]}입니다. 청결하고 쾌적한 환경에서 편안한 휴식을 즐기세요.`,
            '15:00',
            '11:00',
            'active',
            locationIds[i % locationIds.length],
            roomTypeIds[i % roomTypeIds.length],
            roomOptionIds[i % roomOptionIds.length],
            categoryIds[i % categoryIds.length]
        ]);
        createdIds.push(res[0].room_id);
    }
    console.log(`🏡 Rooms: ${createdIds.length}개 생성 (UUID)`);
    return createdIds;
}

// ========== 객실 이미지 ==========
// ========== 객실 이미지 ==========
async function seedRoomImages(dataSource: DataSource, roomIds: string[]) {
    const roomImages = [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502005229766-52838abd8ac5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771753035-48482b0d3db5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop'
    ];

    let imageCount = 0;
    for (const roomId of roomIds) {
        const count = Math.floor(Math.random() * 4) + 3; // 3~6개 이미지
        for (let j = 1; j <= count; j++) {
            await dataSource.query(`
                INSERT INTO room_images (room_id, image_name, path, status)
                VALUES ($1, $2, $3, 'active')
            `, [
                roomId,
                `room_image_${j}.jpg`,
                roomImages[Math.floor(Math.random() * roomImages.length)]
            ]);
            imageCount++;
        }
    }
    console.log(`🖼️ RoomImages: ${imageCount}개 생성`);
}

// ========== 숙소 (listings) ==========
async function seedListings(dataSource: DataSource) {
    const types = ['아파트', '주택', '빌라', '펜션', '호텔', '전통가옥'];

    // 위치 데이터 정의: 국내(대구, 부산, 서울, 제주), 해외(일본, 미국, 필리핀)
    const locations = [
        { name: '대구', lat: 35.8714, lng: 128.6014, addressPrefix: '대구시 중구', imagesType: 'korea_city' },
        { name: '부산', lat: 35.1796, lng: 129.0756, addressPrefix: '부산시 해운대구', imagesType: 'korea_beach' },
        { name: '서울', lat: 37.5665, lng: 126.9780, addressPrefix: '서울시 강남구', imagesType: 'korea_city' },
        { name: '제주', lat: 33.4996, lng: 126.5312, addressPrefix: '제주특별자치도', imagesType: 'korea_nature' },
        { name: '일본', lat: 35.6762, lng: 139.6503, addressPrefix: 'Tokyo, Shibuya', imagesType: 'japan' },
        { name: '미국', lat: 40.7128, lng: -74.0060, addressPrefix: 'New York, Manhattan', imagesType: 'usa' },
        { name: '필리핀', lat: 11.9804, lng: 121.9189, addressPrefix: 'Boracay, Malay', imagesType: 'philippines' },
    ];

    // 이미지 풀 (Location 별 분리) - 카테고리별 10개 내외 확보
    const imagePools = {
        korea_city: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
            // Safe replacements (London/UK style but works for city)
            'https://images.unsplash.com/photo-1486304873000-235643847519?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
            // Replaced 404s again with working images
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop',
        ],
        korea_beach: [
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=800&h=600&fit=crop',
            // Replacements for broken beach images
            'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&h=600&fit=crop', // Maldives/Beach
            'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&h=600&fit=crop', // Beach resort
            'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800&h=600&fit=crop', // Ocean view
        ],
        korea_nature: [
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
        ],
        usa: [
            'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop', // US home
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
        ],
        japan: [
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1596276020587-8044fe049813?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=800&h=600&fit=crop',
        ],
        philippines: [
            'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
        ]
    };

    const amenities = [
        ['WiFi', '에어컨', '주방', '세탁기'],
        ['WiFi', '에어컨', '주방', '주차장', '수영장'],
        ['WiFi', '에어컨', '난방', 'TV', '헬스장'],
        ['WiFi', '에어컨', '조식', '청소서비스'],
    ];

    // 먼저 user ID들을 가져옴 (Create된 7명)
    const users = await dataSource.query(`SELECT id FROM users ORDER BY "createdAt" LIMIT 7`);

    let listingCount = 0;

    // 7명의 유저와 7개의 지역을 1:1 매칭
    for (let i = 0; i < 7; i++) {
        const user = users[i];
        const loc = locations[i];

        // 해당 지역에 맞는 이미지 풀
        const pool = imagePools[loc.imagesType as keyof typeof imagePools] || imagePools['korea_city'];

        // 각 유저는 할당된 지역에 10개의 숙소 생성
        for (let j = 0; j < 10; j++) {
            const randomLat = loc.lat + (Math.random() * 0.05) - 0.025;
            const randomLng = loc.lng + (Math.random() * 0.05) - 0.025;

            // 이미지 선택 전략:
            // - 첫 번째 이미지(메인): pool에서 순차적으로 하나씩 가져옴 (j % pool.length) -> pool이 10개 이상이면 고유함
            // - 나머지 이미지: 랜덤하게 섞음 (단, 첫 번째 이미지와는 다르게)
            const img1 = pool[j % pool.length];
            const img2 = pool[(j + 1) % pool.length];
            const img3 = pool[(j + 2) % pool.length];
            const img4 = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop'; // fallback

            const selectedImages = [img1, img2, img3, img4];

            await dataSource.query(`
                INSERT INTO listings (title, description, type, address, latitude, longitude, images, amenities, 
                                    "maxGuests", "basePrice", "weekendPrice", "smartPricingEnabled", "hostId")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `, [
                `${loc.name}의 ${types[j % types.length]} #${j + 1}`,
                `${loc.name} 중심부에 위치한 멋진 숙소입니다. 편안한 휴식을 즐기세요.`,
                types[j % types.length],
                `${loc.addressPrefix} ${j + 1}번지`,
                randomLat,
                randomLng,
                JSON.stringify(selectedImages),
                JSON.stringify(amenities[j % amenities.length]),
                Math.floor(Math.random() * 6) + 2,
                50000 + (Math.floor(Math.random() * 150000)),
                70000 + (Math.floor(Math.random() * 180000)),
                j % 3 === 0,
                user.id
            ]);
            listingCount++;
        }
    }
    console.log(`🏘️ Listings: 총 ${listingCount}개 생성 (7유저 x 1지역 x 10숙소 = 70개)`);
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
// ========== 예약 상세 (reservations) ==========
async function seedReservations(dataSource: DataSource, roomIds: string[]) {
    for (let i = 0; i < 100; i++) {
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
            roomIds[i % roomIds.length]
        ]);
    }
    console.log('📋 Reservations: 100개 생성');
}

// ========== 대화 (conversations) ==========
async function seedConversations(dataSource: DataSource) {
    const users = await dataSource.query(`SELECT id FROM users`);

    // 고유한 사용자 쌍에만 대화 생성 (중복 방지)
    const createdPairs = new Set<string>();
    let conversationCount = 0;

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            const user1 = users[i].id;
            const user2 = users[j].id;

            // 이미 생성된 쌍인지 확인
            const pairKey = [user1, user2].sort().join('-');
            if (createdPairs.has(pairKey)) continue;
            createdPairs.add(pairKey);

            await dataSource.query(`
                INSERT INTO conversations (title, "participant1Id", "participant2Id", "lastMessageAt")
                VALUES ($1, $2, $3, $4)
            `, [
                `예약 문의 #${conversationCount + 1}`,
                user1,
                user2,
                new Date()
            ]);
            conversationCount++;
        }
    }
    console.log(`💬 Conversations: ${conversationCount}개 생성 (고유 사용자 쌍)`);
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
    // 실제 user ID (UUID) 조회
    const users = await dataSource.query(`SELECT id FROM users`);

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
            users[(i - 1) % users.length].id
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

    // 실제 user ID와 listing ID (UUID) 조회
    const users = await dataSource.query(`SELECT id FROM users`);
    const listings = await dataSource.query(`SELECT id FROM listings`);

    for (let i = 1; i <= 200; i++) {
        await dataSource.query(`
            INSERT INTO reviews (content, rating, listing_id, author_id)
            VALUES ($1, $2, $3, $4)
        `, [
            reviewTexts[i % reviewTexts.length],
            Math.floor(Math.random() * 2) + 4, // 4~5점
            listings[(i - 1) % listings.length].id,
            users[(i - 1) % users.length].id
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