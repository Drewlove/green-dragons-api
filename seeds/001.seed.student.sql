TRUNCATE TABLE student RESTART IDENTITY CASCADE;

INSERT INTO student(first_name, last_name, birth_date)
VALUES
('Drew', 'Love', '1984-09-11'),
('Mike', 'Cermak', '1980-09-01'),
('Ale', 'Cabrera-Mondragon', '1994-06-01');


-- SEED SCRIPT
-- psql -f ~/Projects/A1-Review/green-dragons-api/seeds/001.seed.student.sql green_dragons;
