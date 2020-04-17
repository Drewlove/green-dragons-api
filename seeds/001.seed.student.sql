TRUNCATE TABLE student RESTART IDENTITY CASCADE;

INSERT INTO student(first_name, last_name, birth_date, hair_color)
VALUES
('Mike', 'Cermak', '1980-09-01', 'black'),
('Ale', 'Cabrera-Mondragon', '1994-06-01', 'auburn'),
('Drew', 'Love', '1984-09-11', 'brown');


-- SEED SCRIPT
-- psql -f ~/Projects/A1-Review/green-dragons-api/seeds/001.users/seed.student.sql green_dragons;
