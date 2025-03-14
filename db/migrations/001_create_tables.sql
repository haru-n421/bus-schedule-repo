-- 路線テーブル
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- スケジュールタイプテーブル
CREATE TABLE schedule_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 時刻表テーブル
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id),
    schedule_type_id INTEGER REFERENCES schedule_types(id),
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    minutes INTEGER[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 祝日テーブル
CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期データ投入
INSERT INTO schedule_types (name) VALUES
    ('weekday'),
    ('saturday'),
    ('holiday');

-- 埼京線のデータ
INSERT INTO routes (name) VALUES ('埼京線');

-- 京浜東北線のデータ
INSERT INTO routes (name) VALUES ('京浜東北線');

-- 埼京線の時刻表
WITH route_id AS (SELECT id FROM routes WHERE name = '埼京線'),
     weekday_id AS (SELECT id FROM schedule_types WHERE name = 'weekday'),
     saturday_id AS (SELECT id FROM schedule_types WHERE name = 'saturday'),
     holiday_id AS (SELECT id FROM schedule_types WHERE name = 'holiday')
INSERT INTO schedules (route_id, schedule_type_id, hour, minutes) VALUES
    -- 平日
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 7, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 8, '{0,10,20,30,40,50}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 9, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 10, '{0,15,30,45}'),
    -- 土曜
    ((SELECT id FROM route_id), (SELECT id FROM saturday_id), 8, '{0,30}'),
    ((SELECT id FROM route_id), (SELECT id FROM saturday_id), 9, '{0,30}'),
    ((SELECT id FROM route_id), (SELECT id FROM saturday_id), 10, '{0,30}'),
    -- 休日
    ((SELECT id FROM route_id), (SELECT id FROM holiday_id), 9, '{0,30}'),
    ((SELECT id FROM route_id), (SELECT id FROM holiday_id), 10, '{0,30}'),
    ((SELECT id FROM route_id), (SELECT id FROM holiday_id), 11, '{0,30}');

-- 京浜東北線の時刻表
WITH route_id AS (SELECT id FROM routes WHERE name = '京浜東北線'),
     weekday_id AS (SELECT id FROM schedule_types WHERE name = 'weekday'),
     saturday_id AS (SELECT id FROM schedule_types WHERE name = 'saturday'),
     holiday_id AS (SELECT id FROM schedule_types WHERE name = 'holiday')
INSERT INTO schedules (route_id, schedule_type_id, hour, minutes) VALUES
    -- 平日
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 7, '{0,10,20,30,40,50}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 8, '{0,5,10,15,20,25,30,35,40,45,50,55}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 9, '{0,10,20,30,40,50}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 10, '{0,10,20,30,40,50}'),
    -- 土曜
    ((SELECT id FROM route_id), (SELECT id FROM saturday_id), 8, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM saturday_id), 9, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM saturday_id), 10, '{0,15,30,45}'),
    -- 休日
    ((SELECT id FROM route_id), (SELECT id FROM holiday_id), 9, '{0,20,40}'),
    ((SELECT id FROM route_id), (SELECT id FROM holiday_id), 10, '{0,20,40}'),
    ((SELECT id FROM route_id), (SELECT id FROM holiday_id), 11, '{0,20,40}');

-- 祝日データ
INSERT INTO holidays (date) VALUES
    ('2025-01-01'),
    ('2025-03-21');
