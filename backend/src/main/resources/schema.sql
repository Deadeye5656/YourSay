DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS verification;
DROP TABLE IF EXISTS legislation;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    zipcode VARCHAR(5),
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
    state VARCHAR(2),
    zipcode VARCHAR(5),
    date DATE
);

INSERT INTO users (email, password, zipcode, preferences) VALUES
('test@test.com', 'password123', '12345', 'local,state')
ON CONFLICT (email) DO NOTHING;

INSERT INTO verification (email, code) VALUES
('test@test.com', 123123)
ON CONFLICT (email) DO NOTHING;

INSERT INTO legislation (bill_id, title, description, level, state, zipcode, date) VALUES
('123', 'bill title', 'bill description', 'LOCAL', 'MI', '12345', '2023-01-01'),
('124', 'another bill title', 'another bill description', 'STATE', 'MI', '12345', '2023-02-01'),
('125', 'federal bill title', 'federal bill description', 'FEDERAL', 'US', NULL, '2023-03-01')
ON CONFLICT (bill_id) DO NOTHING;