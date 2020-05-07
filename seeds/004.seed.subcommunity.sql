TRUNCATE TABLE subcommunity RESTART IDENTITY CASCADE; 

INSERT INTO subcommunity(subcommunity_name, community_id)

VALUES
('Grodojo 1', 1),
('Grodojo 2', 1),
('Grodojo 3', 1),
('Green Dragons 1', 2),
('Green Dragons 2', 2),
('Green Dragons 3', 2),
('Sprouts 1', 3),
('Sprouts 2', 3),
('Sprouts 3', 3);