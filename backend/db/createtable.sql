create table chatbot(
    chatbot_id INT AUTO_INCREMENT primary key,
    message TEXT not null,
    intent varchar(255) not null,
    ai_answer TEXT not null,
    ticket_id INT not null,
    email varchar(100),
    status TEXT,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP
);


select * from chatbot;

create table chat_messages(
    message_id INT AUTO_INCREMENT primary key,
    message_text TEXT not null,
    message_type varchar(50) not null,
    created_at TIMESTAMP not null,
    is_read boolean,
    status TEXT,
    session_id INT not null,
    chatbot_id INT not null
);

create table chatbot_session(
    session_id int AUTO_INCREMENT primary key,
    started_at TIMESTAMP not null,
    ended_at TIMESTAMP not null,
    status TEXT,
    chatbot_id int not null,
    user_id int not null
);

create table chatbot_logs(
    log_id INT AUTO_INCREMENT primary key,
    request_text TEXT not null,
    response_text TEXT not null,
    response_status TEXT not null,
    response_time FLOAT,
    created_at timestamp not null,
    chatbot_id int not null,
    session_id int not null
);

drop table chatbot;
drop table chatbot_logs;
drop table chat_messages;
drop table chatbot_session;

alter table chatbot_logs
add constraint Foreign Key (chatbot_id) REFERENCES chatbot(chatbot_id)
on delete CASCADE
on update CASCADE;

alter table chatbot_logs
add constraint Foreign Key (session_id) REFERENCES chatbot_session(session_id)
on delete CASCADE
on update CASCADE;

alter table chat_messages
add constraint Foreign Key (session_Id) REFERENCES chatbot_session(session_id)
on delete CASCADE
on update CASCADE;

alter table chat_messages
add constraint Foreign Key (chatbot_id) REFERENCES chatbot(chatbot_id)
on delete CASCADE
on update CASCADE;

alter table chatbot_session
add constraint FOREIGN key (chatbot_id)
REFERENCES chatbot(chatbot_id)
on delete CASCADE
on update CASCADE;

# users 테이블 만들고 실행
alter table chatbot_session
add constraint FOREIGN key (chatbot_id)
REFERENCES chatbot(chatbot_id)
on delete CASCADE
on update CASCADE;

create table users(
    user_id int AUTO_INCREMENT PRIMARY key,
    user_name varchar(20) not null,
    user_sex int not null,
    user_email varchar(50) not null,
    user_birth date not null,
    user_password varchar(200) not null,
    user_phone_number int not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP not null,
    status TEXT
);

create table user_profile(
    user_id int AUTO_INCREMENT primary key,
    image_name varchar(50) not null,
    path TEXT not null,
    introduction_text text,
    location text not null,
    language varchar(100) not null,
    job text,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text,
    Foreign Key (user_id) REFERENCES users(user_id)
);

# 방 정보 만들고 fk하기
create table reviews(
    review_id int AUTO_INCREMENT PRIMARY key,
    content_text TEXT not null,
    created_at TIMESTAMP not null,
    updated_at timestamp,
    status text,
    star_point int,
    room_id int not null,
    user_id int not null
);
alter table reviews
add constraint FOREIGN key (room_id)
REFERENCES rooms(room_id)
on delete CASCADE
on update cascade;

create table categories(
    category_id int AUTO_INCREMENT PRIMARY key,
    category_name VARCHAR(50) not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text
);

create table room_types(
    room_types_id int AUTO_INCREMENT PRIMARY key,
    types_name VARCHAR(50) not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMp,
    status text
);

# 방 정보 만들고 room_id fk하기
create table room_images(
    room_id int AUTO_INCREMENT PRIMARY key,
    image_name VARCHAR(200) not null,
    path text not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text
);
alter table room_images
add constraint FOREIGN key (room_id)
references rooms(room_id)
on delete CASCADE
on update CASCADE;

create table room_options(
    room_option_id int AUTO_INCREMENT PRIMARY key,
    item1 int not null,
    item2 int not null,
    item3 int not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text
);

create table locations(
    location_id int AUTO_INCREMENT PRIMARY key,
    location_name varchar(100) not null,
    description_location text not null,
    description_traffic text not null
);

create table property_middle_table(
    property_middle_id int AUTO_INCREMENT PRIMARY key,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text,
    property_id int not null,
    room_id int not null
);

create table property(
    property_id int AUTO_INCREMENT primary key,
    property_name VARCHAR(50) not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text
);

# 방정보 만들면 room_id fk 해야함
alter table property_middle_table
add constraint Foreign Key (property_id)
REFERENCES property(property_id)
on delete CASCADE
on update cascade;

alter table property_middle_table
add constraint Foreign Key (room_id) REFERENCES rooms(room_id)
on delete CASCADE
on update CASCADE;

create table rooms(
    room_id int AUTO_INCREMENT PRIMARY key,
    room_name varchar(50) not null,
    room_address varchar(100) not null,
    room_price int not null,
    room_wishes int not null default 0,
    room_description text,
    check_in_time time not null,
    check_out_time time not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text,
    location_id int not null,
    room_types_id int not null,
    room_option_id int not null,
    category_id int not null,
    Foreign Key (location_id) REFERENCES locations(location_id),
    Foreign Key (room_types_id) REFERENCES room_types(room_types_id),
    Foreign Key (room_option_id) REFERENCES room_options(room_option_id),
    Foreign Key (category_id) REFERENCES categories(category_id)
);

select * from rooms;


create table room_funny(
    funny_id int AUTO_INCREMENT PRIMARY key,
    funny_name VARCHAR(100) not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text
);
create table room_middle_funny(
    room_funny_id int AUTO_INCREMENT PRIMARY key,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text,
    funny_id int not null,
    room_id int not null,
    Foreign Key (funny_id) REFERENCES room_funny(funny_id),
    Foreign Key (room_id) REFERENCES rooms(room_id)
);


create table wishelists(
    wishes_id int AUTO_INCREMENT PRIMARY key,
    wishes_name VARCHAR(50) not null,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text
);

create table wishes_middle(
    wishes_middle_id int AUTO_INCREMENT PRIMARY key,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text,
    wishes_id int not null,
    room_id int not null,
    Foreign Key (wishes_id) REFERENCES wishelists(wishes_id),
    Foreign Key (room_id) REFERENCES rooms(room_id)
);

create table reservation(
    reservation_id int AUTO_INCREMENT PRIMARY key,
    check_in_date DATETIME not null,
    check_out_date DATETIME not null,
    adults int,
    childeren int,
    infants int,
    pets int,
    created_at TIMESTAMP not null,
    updated_at TIMESTAMP,
    status text,
    room_id int not null,
    Foreign Key (room_id) REFERENCES rooms(room_id)
);
ALTER TABLE locations ADD lat DOUBLE;
ALTER TABLE locations ADD lng DOUBLE;
ALTER TABLE locations ADD neighbourhood VARCHAR(100);
ALTER TABLE locations ADD neighbourhood_group VARCHAR(100);


create table hosts(
    host_id BIGINT PRIMARY key,
    host_name VARCHAR(100),
    identity_verified VARCHAR(20),
    listing_count INT
);
