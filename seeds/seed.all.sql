BEGIN;
\i /Users/Drew/Projects/green-dragons-api/seeds/001.seed.student.sql
\i /Users/Drew/Projects/green-dragons-api/seeds/002.seed.challenge.sql
\i /Users/Drew/Projects/green-dragons-api/seeds/003.seed.community.sql
\i /Users/Drew/Projects/green-dragons-api/seeds/004.seed.subcommunity.sql
\i /Users/Drew/Projects/green-dragons-api/seeds/005.seed.exchange.sql
\i /Users/Drew/Projects/green-dragons-api/seeds/006.seed.challenge_entry.sql

COMMIT;

-- SEED ALL, copy and paste: psql -f ~/Projects/green-dragons-api/seeds/seed.all.sql green_dragons;
