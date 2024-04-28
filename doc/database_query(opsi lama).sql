-- CREATE TABLE users (
--     id VARCHAR(36) NOT NULL PRIMARY KEY,
--     name VARCHAR(40) NOT NULL,
--     email VARCHAR(60) NOT NULL UNIQUE,
--     nohp VARCHAR(16) NOT NULL,
--     password VARCHAR(128) NOT NULL,
--     role VARCHAR(40) NOT NULL,
--     jobdesk VARCHAR(40),
--     residence VARCHAR(40),
--     workplace VARCHAR(40),
--     description TEXT,
--     job_type VARCHAR(40),
--     instagram VARCHAR(40),
--     linkedin VARCHAR(40),
--     github VARCHAR(40),
--     gitlab VARCHAR(40),
--     image VARCHAR,
--     banner_image VARCHAR,
--     company_name VARCHAR(40),
--     company_field VARCHAR(40),
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- create table skills(
--     id VARCHAR(36) not null primary key,
--     name VARCHAR(20) not null,
--     created_at TIMESTAMP not null default current_timestamp
-- );

-- create table worker_skills(
--     id VARCHAR(36) not null primary key,
--     id_worker VARCHAR(36) references users on update cascade on delete cascade,
--     foreign key (id_worker) references users(id),
--     id_skill VARCHAR(36) references skills on update cascade on delete cascade,
--     foreign key (id_skill) references skills(id),
--     created_at TIMESTAMP not null default current_timestamp
-- );

-- create table portfolios(
--     id VARCHAR(36) not null primary key,
--     id_worker VARCHAR(36) references users on update cascade on delete cascade,
--     foreign key (id_worker) references users(id),
--     name VARCHAR(40) not null,
--     repo_link VARCHAR not null,
--     portfolio_type VARCHAR not null,
--     image VARCHAR not null,
--     create_at TIMESTAMP not null default current_timestamp
    
-- );

-- create table work_experiences(
--     id VARCHAR(36) not null primary key,
--     id_worker VARCHAR(36) references users on update cascade on delete cascade,
--     foreign key (id_worker) references users(id),
--     jobdesk VARCHAR(40) not null,
--     company_name VARCHAR(40) not null,
--     date_start VARCHAR not null,
--     date_end VARCHAR,
--     description text not null,
--     image VARCHAR,
--     created_at TIMESTAMP not null default current_timestamp
-- );



-- CREATE TABLE hire (
--     id VARCHAR(36) not null PRIMARY KEY,
--     id_worker VARCHAR(36) REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE,
--     foreign key (id_worker) references users(id),
--     id_recruiter VARCHAR(36) REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE,
--     foreign key (id_recruiter) references users(id),
--     reason VARCHAR(255) NOT NULL,
--     name VARCHAR(40) NOT NULL,
--     email VARCHAR(60) NOT NULL,
--     nohp VARCHAR(16) NOT NULL,
--     description TEXT,
--     created_at TIMESTAMP not null default current_timestamp
-- );



create table workers(
    id varchar(36) not null primary key,
    name varchar(40) not null,
    email varchar(60) not null unique,
    nohp varchar(16) not null,
    password varchar(128) not null,
    role varchar(40) not null,
    image varchar,
    jobdesk varchar(40),
    domicile varchar(40),
    workplace varchar(40),
    description text,
    job_type varchar(40),
    instagram varchar(40),
    github varchar(40),
    gitlab varchar(40),
    created_at TIMESTAMP not null default current_timestamp
);

create table recruiters(
    id varchar(36) not null primary key,
    name varchar(40) not null,
    email varchar(60) not null unique,
    company_name varchar(40) not null,
    company_field varchar(40) not null,
    nohp varchar(16) not null,
    password varchar(128) not null,
    role varchar(40) not null,
    company_city varchar(40),
    image varchar,
    workplace varchar(40),
    description text,
    instagram varchar(40),
    linkedin varchar(40),
    banner_image varchar,
    created_at TIMESTAMP not null default current_timestamp
);


create table skills(
    id VARCHAR(36) not null primary key,
    name VARCHAR(20) not null,
    created_at TIMESTAMP not null default current_timestamp
);

create table worker_skills(
    id VARCHAR(36) not null primary key,
    id_worker VARCHAR(36) references workers on update cascade on delete cascade,
    foreign key (id_worker) references workers(id),
    id_skill VARCHAR(36) references skills on update cascade on delete cascade,
    foreign key (id_skill) references skills(id),
    created_at TIMESTAMP not null default current_timestamp
);

create table portfolios(
    id VARCHAR(36) not null primary key,
    id_worker VARCHAR(36) references workers on update cascade on delete cascade,
    foreign key (id_worker) references workers(id),
    name VARCHAR(40) not null,
    repo_link VARCHAR not null,
    portfolio_type VARCHAR not null,
    image VARCHAR not null,
    created_at TIMESTAMP not null default current_timestamp
    
);

create table work_experiences(
    id VARCHAR(36) not null primary key,
    id_worker VARCHAR(36) references workers on update cascade on delete cascade,
    foreign key (id_worker) references workers(id),
    jobdesk VARCHAR(40) not null,
    company_name VARCHAR(40) not null,
    date_start date not null,
    date_end date,
    description text not null,
    image VARCHAR,
    created_at TIMESTAMP not null default current_timestamp
);



CREATE TABLE hire (
    id VARCHAR(36) not null PRIMARY KEY,
    id_worker VARCHAR(36) REFERENCES workers ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (id_worker) references workers(id),
    id_recruiter VARCHAR(36) REFERENCES recruiters ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (id_recruiter) references recruiters(id),
    reason VARCHAR(255) NOT NULL,
    name VARCHAR(40) NOT NULL,
    email VARCHAR(60) NOT NULL,
    nohp VARCHAR(16) NOT NULL,
    description TEXT,
    created_at TIMESTAMP not null default current_timestamp
);



