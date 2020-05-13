TRUNCATE TABLE student_subcommunity RESTART IDENTITY CASCADE;

INSERT INTO student_subcommunity(student_id, subcommunity_id)

VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 7),
(3, 8),
(3, 9);

-- SEED SCRIPT
-- psql -f psql -f ~/Projects/green-dragons-api/seeds/007.seed.student_community.sql green_dragons;