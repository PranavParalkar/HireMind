-- Run this in psql or pgAdmin to create the database
-- psql -U postgres -f setup_db.sql

CREATE DATABASE hiremind;

-- Connect to the database and verify
\c hiremind
SELECT current_database();
-- Tables are created automatically by SQLAlchemy on first startup
