DROP TABLE IF EXISTS community CASCADE; 

CREATE TABLE community(
    community_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    community_name TEXT NOT NULL 
);