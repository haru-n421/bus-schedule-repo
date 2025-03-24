-- 埼京線の平日時刻表を更新
WITH route_id AS (SELECT id FROM routes WHERE name = '埼京線'),
     weekday_id AS (SELECT id FROM schedule_types WHERE name = 'weekday')
INSERT INTO schedules (route_id, schedule_type_id, hour, minutes) VALUES
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 11, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 12, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 13, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 14, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 15, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 16, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 17, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 18, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 19, '{0,15,30,45}'),
    ((SELECT id FROM route_id), (SELECT id FROM weekday_id), 20, '{0,15,30,45}');
