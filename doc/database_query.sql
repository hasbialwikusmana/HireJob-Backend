CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    company VARCHAR,
    position VARCHAR,
    description VARCHAR,
    photo VARCHAR,
    role VARCHAR NOT NULL,
    instagram VARCHAR,
    github VARCHAR,
    linkedin VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);