BEGIN;
\i /Users/Drew/Projects/green-dragons-api/seeds/001.seed.student.sql
\i /Users/Drew/Projects/green-dragons-api/seeds/002.seed.challenge.sql

COMMIT;

-- SEED ALL, copy and paste: psql -f ~/Projects/green-dragons-api/seeds/seed.all.sql green_dragons;
