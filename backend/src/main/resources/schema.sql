DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS verification;
DROP TABLE IF EXISTS legislation;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    zipcode VARCHAR(5),
    state VARCHAR(2),
    preferences VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS verification (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    code INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS legislation (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    bill_level VARCHAR(20) NOT NULL, -- local, state, federal
    state VARCHAR(2),
    zipcode VARCHAR(5),
    city VARCHAR(100),
    bill_date VARCHAR(10),
    category VARCHAR(50)
);

INSERT INTO users (email, password, zipcode, preferences, state) VALUES
('test@test.com', '$2a$10$abcdefghijklmnopqrstuuNYVhuCzN8W/N3q6oBTpBoHaLLh6DgBG', '48315', 'Civil Rights', 'MI')
ON CONFLICT (email) DO NOTHING;

INSERT INTO verification (email, code) VALUES
('test@test.com', 123123)
ON CONFLICT (email) DO NOTHING;

INSERT INTO legislation (bill_id, title, description, bill_level, state, zipcode, city, bill_date, category) VALUES
('123', 'bill title 1', 'bill descriptionlong testlong testlong testlong testlong testlong testlong test', 'LOCAL', 'MI', '48315', 'NYC', '2023-01-01', 'Healthcare'),
('124', 'bill title 2', 'bill description', 'LOCAL', 'MI', '48315', 'NYC', '2023-01-01', 'Taxes'),
('125', 'another bill title 1', 'another bill description long test long testlong testlong testlong testlong testlong testlong testlong testlong test', 'STATE', 'MI', '48315', NULL, '2023-02-01', 'Education'),
('126', 'another bill title 2', 'another bill descriptionlong testlong testlong testlong testlong testlong testlong test', 'STATE', 'MI', '48315', NULL, '2023-02-01', 'Environment'),
('127', 'federal bill title 1', 'federal bill descriptionlong testlong testlong testlong testlong testlong testlong test', 'FEDERAL', 'US', NULL, NULL, '2023-03-01', 'Gun Control'),
('128', 'federal bill title 2', 'federal bill descriptionlong testlong testlong testlong testlong testlong testlong testlong test', 'FEDERAL', 'US', NULL, NULL, '2023-03-01', 'Civil Rights')
ON CONFLICT (bill_id) DO NOTHING;