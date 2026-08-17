-- ============================================
-- Library Management System Database
-- ============================================

-- ============================================
-- Categories
-- ============================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Users
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('ADMIN', 'MEMBER'))
);

-- ============================================
-- Books
-- ============================================

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    published_year INTEGER,
    quantity INTEGER NOT NULL DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    category_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT books_quantity_check
        CHECK (quantity >= 0),

    CONSTRAINT books_available_quantity_check
        CHECK (available_quantity >= 0),

    CONSTRAINT books_category_fk
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- ============================================
-- Borrowings
-- ============================================

CREATE TABLE borrowings (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,

    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    returned_at TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'BORROWED',

    CONSTRAINT borrowings_status_check
        CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE')),

    CONSTRAINT borrowings_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT borrowings_book_fk
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);