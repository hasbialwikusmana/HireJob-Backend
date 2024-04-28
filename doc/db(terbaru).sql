-- Tabel users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Tabel workers
CREATE TABLE workers (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    job_desk VARCHAR(100),
    domicile VARCHAR(100),
    workplace VARCHAR(100),
    description TEXT,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel recruiters
CREATE TABLE recruiters (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    position VARCHAR(100),
    city VARCHAR(100),
    description TEXT,
    phone VARCHAR(15),
    instagram VARCHAR(100),
    linkedin VARCHAR(100),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel skills
CREATE TABLE skills (
    id UUID PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    skill_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel work_experience
CREATE TABLE work_experience (
    id UUID PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    position VARCHAR(100),
    company VARCHAR(100),
    work_month VARCHAR(10),
    work_year INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Portofolio
CREATE TABLE portfolio (
    id UUID PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    application_name VARCHAR(100),
    link_repo VARCHAR(255),
    portfolio_type VARCHAR(100),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel hire
CREATE TABLE hire (
    id UUID PRIMARY KEY,
    message_purpose VARCHAR(255),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE CASCADE,
    name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(15),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
