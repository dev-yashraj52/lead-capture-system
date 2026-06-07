CREATE DATABASE lead_management;
USE lead_management;

CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    company VARCHAR(255),
    source VARCHAR(100),
    status ENUM('new','contacted','qualified','lost')
        DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);