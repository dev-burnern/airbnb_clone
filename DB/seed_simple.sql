-- 사용자 생성 (비밀번호: 123456의 bcrypt 해시)
INSERT INTO users (email, password, name, "avatarUrl", roles, provider)
VALUES 
    ('user1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqHo6kQ8Yd1OQvFRjKNZpOH6AQ6FQZC', '김민수', 'https://i.pravatar.cc/150?img=1', 'host,guest', 'local'),
    ('user2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqHo6kQ8Yd1OQvFRjKNZpOH6AQ6FQZC', '이영희', 'https://i.pravatar.cc/150?img=2', 'host,guest', 'local'),
    ('user3@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqHo6kQ8Yd1OQvFRjKNZpOH6AQ6FQZC', '박철수', 'https://i.pravatar.cc/150?img=3', 'host,guest', 'local'),
    ('user4@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqHo6kQ8Yd1OQvFRjKNZpOH6AQ6FQZC', '최지은', 'https://i.pravatar.cc/150?img=4', 'host,guest', 'local'),
    ('user5@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqHo6kQ8Yd1OQvFRjKNZpOH6AQ6FQZC', '정대현', 'https://i.pravatar.cc/150?img=5', 'host,guest', 'local'),
    ('user6@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqHo6kQ8Yd1OQvFRjKNZpOH6AQ6FQZC', '강서연', 'https://i.pravatar.cc/150?img=6', 'host,guest', 'local'),
    ('user7@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqHo6kQ8Yd1OQvFRjKNZpOH6AQ6FQZC', '윤재호', 'https://i.pravatar.cc/150?img=7', 'host,guest', 'local')
ON CONFLICT (email) DO NOTHING;

-- 숙소 생성 (각 지역별로 10개씩)
DO $$
DECLARE
    user_ids UUID[];
    i INTEGER;
    j INTEGER;
    loc RECORD;
    user_id UUID;
    random_lat DOUBLE PRECISION;
    random_lng DOUBLE PRECISION;
    types TEXT[] := ARRAY['아파트', '주택', '빌라', '펜션', '호텔', '전통가옥'];
    amenities_list JSONB[] := ARRAY[
        '["WiFi", "에어컨", "주방", "세탁기"]'::JSONB,
        '["WiFi", "에어컨", "주방", "주차장", "수영장"]'::JSONB,
        '["WiFi", "에어컨", "난방", "TV", "헬스장"]'::JSONB,
        '["WiFi", "에어컨", "조식", "청소서비스"]'::JSONB
    ];
    images_korea JSONB := '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop"]';
    images_beach JSONB := '["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&h=600&fit=crop"]';
    images_nature JSONB := '["https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"]';
    images_usa JSONB := '["https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"]';
    images_japan JSONB := '["https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1596276020587-8044fe049813?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop"]';
    images_phil JSONB := '["https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop"]';
    selected_images JSONB;
BEGIN
    -- 사용자 ID 가져오기
    SELECT ARRAY_AGG(id ORDER BY "createdAt") INTO user_ids FROM users LIMIT 7;
    
    -- 위치별 숙소 생성
    FOR i IN 0..6 LOOP
        user_id := user_ids[i + 1];
        
        FOR j IN 1..10 LOOP
            -- 위치에 따라 이미지 선택
            CASE i
                WHEN 0 THEN -- 대구
                    random_lat := 35.8714 + (random() * 0.05 - 0.025);
                    random_lng := 128.6014 + (random() * 0.05 - 0.025);
                    selected_images := images_korea;
                WHEN 1 THEN -- 부산
                    random_lat := 35.1796 + (random() * 0.05 - 0.025);
                    random_lng := 129.0756 + (random() * 0.05 - 0.025);
                    selected_images := images_beach;
                WHEN 2 THEN -- 서울
                    random_lat := 37.5665 + (random() * 0.05 - 0.025);
                    random_lng := 126.9780 + (random() * 0.05 - 0.025);
                    selected_images := images_korea;
                WHEN 3 THEN -- 제주
                    random_lat := 33.4996 + (random() * 0.05 - 0.025);
                    random_lng := 126.5312 + (random() * 0.05 - 0.025);
                    selected_images := images_nature;
                WHEN 4 THEN -- 일본
                    random_lat := 35.6762 + (random() * 0.05 - 0.025);
                    random_lng := 139.6503 + (random() * 0.05 - 0.025);
                    selected_images := images_japan;
                WHEN 5 THEN -- 미국
                    random_lat := 40.7128 + (random() * 0.05 - 0.025);
                    random_lng := -74.0060 + (random() * 0.05 - 0.025);
                    selected_images := images_usa;
                WHEN 6 THEN -- 필리핀
                    random_lat := 11.9804 + (random() * 0.05 - 0.025);
                    random_lng := 121.9189 + (random() * 0.05 - 0.025);
                    selected_images := images_phil;
            END CASE;
            
            INSERT INTO listings (title, description, type, address, latitude, longitude, images, amenities, "maxGuests", "basePrice", "weekendPrice", "smartPricingEnabled", "hostId")
            VALUES (
                CASE i
                    WHEN 0 THEN '대구의 ' || types[(j % 6) + 1] || ' #' || j
                    WHEN 1 THEN '부산의 ' || types[(j % 6) + 1] || ' #' || j
                    WHEN 2 THEN '서울의 ' || types[(j % 6) + 1] || ' #' || j
                    WHEN 3 THEN '제주의 ' || types[(j % 6) + 1] || ' #' || j
                    WHEN 4 THEN '일본의 ' || types[(j % 6) + 1] || ' #' || j
                    WHEN 5 THEN '미국의 ' || types[(j % 6) + 1] || ' #' || j
                    WHEN 6 THEN '필리핀의 ' || types[(j % 6) + 1] || ' #' || j
                END,
                '편안한 휴식을 즐길 수 있는 멋진 숙소입니다. 청결하고 쾌적한 환경에서 특별한 여행을 경험하세요.',
                types[(j % 6) + 1],
                CASE i
                    WHEN 0 THEN '대구시 중구 ' || j || '번지'
                    WHEN 1 THEN '부산시 해운대구 ' || j || '번지'
                    WHEN 2 THEN '서울시 강남구 ' || j || '번지'
                    WHEN 3 THEN '제주특별자치도 ' || j || '번지'
                    WHEN 4 THEN 'Tokyo, Shibuya ' || j
                    WHEN 5 THEN 'New York, Manhattan ' || j
                    WHEN 6 THEN 'Boracay, Malay ' || j
                END,
                random_lat,
                random_lng,
                selected_images,
                amenities_list[(j % 4) + 1],
                2 + floor(random() * 6)::int,
                50000 + floor(random() * 150000)::int,
                70000 + floor(random() * 180000)::int,
                (j % 3) = 0,
                user_id
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Created 70 listings';
END $$;

-- 결과 확인
SELECT COUNT(*) as users FROM users;
SELECT COUNT(*) as listings FROM listings;
