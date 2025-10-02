DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS verification;
DROP TABLE IF EXISTS legislation;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    zipcode VARCHAR(10),
    preferences VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS verification (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    code INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS legislation (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    level VARCHAR(20) NOT NULL, -- local, state, federal
    state VARCHAR(50),
    date DATE
);

INSERT INTO users (email, password, phone_number, zipcode, preferences) VALUES
('test@test.com', 'password123', '123-456-7890', '12345', 'local,state')
ON CONFLICT (email) DO NOTHING;

INSERT INTO verification (email, code) VALUES
('7', 123123)
ON CONFLICT (email) DO NOTHING;