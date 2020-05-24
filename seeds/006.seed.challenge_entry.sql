TRUNCATE TABLE challenge_entry RESTART IDENTITY CASCADE; 

INSERT INTO challenge_entry(challenge_id, student_id, record, entry_date, notes)
VALUES
(1, 1, 10, '2020-01-01', 'jump rope'),
(1, 1, 30, '2020-03-21', 'jump rope'),
(1, 1, 20, '2020-02-01', 'jump rope'),
(2, 1, 25, '2020-03-11', 'boxing'),
(2, 1, 40, '2020-01-21', 'boxing'),
(2, 1, 35, '2020-02-01', 'boxing'),
(4, 1, 200, '2020-02-11', '1/2 mile run'),
(4, 1, 181, '2020-02-21', '1/2 mile run'),
(4, 1, 195, '2020-03-02', '1/2 mile run'),
(1, 2, 32, '2020-01-01', 'jump rope'),
(1, 2, 22, '2020-03-21', 'jump rope'),
(1, 2, 24, '2020-02-01', 'jump rope'),
(2, 2, 22, '2020-02-11', 'boxing'),
(2, 2, 30, '2020-02-21', 'boxing'),
(2, 2, 28, '2020-02-28', 'boxing'),
(4, 2, 170, '2020-02-11', '1/2 mile run'),
(4, 2, 165, '2020-02-21', '1/2 mile run'),
(4, 2, 180, '2020-03-01', '1/2 mile run'),
(1, 3, 22, '2020-01-01', 'jump rope'),
(1, 3, 34, '2020-03-21', 'jump rope'),
(1, 3, 27, '2020-02-01', 'jump rope'),
(2, 3, 45, '2020-02-11', 'boxing'),
(2, 3, 46, '2020-02-21', 'boxing'),
(2, 3, 50, '2020-02-28', 'boxing'),
(4, 3, 150, '2020-02-11', '1/2 mile run'),
(4, 3, 135, '2020-02-21', '1/2 mile run'),
(4, 3, 120, '2020-03-01', '1/2 mile run');

-- SEED SCRIPT
-- psql -f psql -f ~/Projects/green-dragons-api/seeds/006.seed.challenge_entry.sql green_dragons;
