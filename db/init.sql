CREATE TABLE user(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'mod') DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE traveller(
    traveller_id SERIAL PRIMARY KEY,
    dni VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE travel(
    travel_id SERIAL PRIMARY KEY,
    travel_code VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    seat_quantity INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destiny VARCHAR(50) NOT NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE travels(
    travels_id SERIAL PRIMARY KEY,
    traveller_id INTEGER REFERENCES traveller(traveller_id) NOT NULL,
    travel_id INTEGER REFERENCES travel(travel_id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);