TRUNCATE student RESTART IDENTITY CASCADE; 

INSERT INTO student(last_name, first_name)

VALUES
('Drew', 'Love'),
('Ryan', 'Love'),
('Marla', 'Love'),
('David', 'Love')

-- psql -f ~/Projects/green-dragons-api/seeds/001.seed.student.sql green_dragons;
