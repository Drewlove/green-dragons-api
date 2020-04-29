TRUNCATE TABLE challenge RESTART IDENTITY CASCADE;

INSERT INTO challenge
(challenge_name, challenge_description, challenge_best_record , units)
VALUES

(
'Jump Rope Challenge',
'Jump rope as many times as you can in 1 minute.',
'highest',
'jumps'
),

(
  'Fitness Boxing',
  'Hit as many targets as possible in 2 minutes.',
  'highest',
  'seconds'
),

(
  'Archery Accuracy',
  'Score as many points as you can in 5 shots with the bow and arrow',
  'highest',
  'targets'
),

(
  '1/2 Mile Run',
  'Run a 1/2 mile as fast as possible.',
  'lowest',
  'seconds');

-- SEED SCRIPT
-- psql -f psql -f ~/Projects/green-dragons-api/seeds/002.seed.challenge.sql green_dragons;

