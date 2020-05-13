TRUNCATE TABLE exchange RESTART IDENTITY CASCADE; 

INSERT INTO EXCHANGE(student_id, exchange_date, amount, note)

VALUES
(1, '2000-01-01', 1.00, 'note 1'), 
(1, '2000-01-03', 3.00, 'note 2'),
(1, '2000-01-02', 2.00, 'note 3'),
(2, '2000-01-03', 4.00, 'note 4'),
(2, '2000-01-01', 6.00, 'note 5'), 
(2, '2000-01-02', 5.00, 'note 6'),
(3, '2000-01-02', 8.00, 'note 7'),
(3, '2000-01-03', 9.00, 'note 8'), 
(3, '2000-01-01', 7.00, 'note 9'),
(3, '2000-01-01', 7.00, 'note 9'),
(3, '2000-01-02', 8.00, 'note 7'),
(3, '2000-01-03', 9.00, 'note 8'), 
(3, '2000-01-01', 7.00, 'note 9'),
(3, '2000-01-01', 7.00, 'note 9'),
(3, '2000-01-02', 8.00, 'note 7'),
(3, '2000-01-03', 9.00, 'note 8'), 
(3, '2000-01-01', 7.00, 'note 9'),
(3, '2000-01-01', 7.00, 'note 9');

-- SEED SCRIPT
-- psql -f psql -f ~/Projects/green-dragons-api/seeds/005.seed.exchange.sql green_dragons;
