CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    role ENUM('admin', 'user', 'mod') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE traveller (
    traveller_id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE travel (
    travel_id INT AUTO_INCREMENT PRIMARY KEY,
    travel_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    seat_quantity INT NOT NULL,
    date DATETIME NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destiny VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE travels (
    travels_id INT AUTO_INCREMENT PRIMARY KEY,
    traveller_id INT NOT NULL,
    travel_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (traveller_id)
        REFERENCES traveller(traveller_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (travel_id)
        REFERENCES travel(travel_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);