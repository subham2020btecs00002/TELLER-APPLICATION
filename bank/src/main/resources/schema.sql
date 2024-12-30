create database bank;

use bank;

CREATE TABLE Customer (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Account (
    account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    opening_balance DOUBLE NOT NULL,
    closing_balance DOUBLE NOT NULL,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

CREATE TABLE Transaction (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE NOT NULL,
    type VARCHAR(50) NOT NULL,
    account_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES Account(account_id)
);
DESCRIBE ACCOUNT;