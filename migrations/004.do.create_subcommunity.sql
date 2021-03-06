DROP TABLE IF EXISTS subcommunity CASCADE; 

CREATE TABLE subcommunity(
    subcommunity_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    subcommunity_name TEXT NOT NULL, 
    community_id INTEGER REFERENCES community(community_id) ON DELETE CASCADE NOT NULL
);