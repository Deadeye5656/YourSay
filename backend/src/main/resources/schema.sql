CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    zipcode VARCHAR(10),
    preferences VARCHAR(255)
);

CREATE TABLE legislation (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(20) NOT NULL, -- local, state, federal
    state VARCHAR(50),
    zipcode VARCHAR(10),
    date DATE
);
