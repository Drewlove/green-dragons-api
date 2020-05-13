TRUNCATE TABLE community RESTART IDENTITY CASCADE; 

INSERT INTO community(community_name)

VALUES
('Grodojo'),
('Green Dragons'),
('Sprouts');

-- SEED SCRIPT
-- psql -f psql -f ~/Projects/green-dragons-api/seeds/003.seed.community.sql green_dragons;