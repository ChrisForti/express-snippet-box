create extension if none exist citext;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL primary key,
    email citext UNIQUE NOT NULL,
    first_name varchar(25) NOT NULL,
    last_name varchar(25),
    password text not null,
    email_verified boolean not null default false,
);


CREATE TABLE IF NOT EXISTS snippets(
    title varchar(255) not null,
    creation_date integer default extract (epoch from now()) not null,
    expiration_date integer not null,
    snippet_id uuid default gen_random_uuid() primary key not null,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content text not null
);


CREATE TABLE IF NOT EXISTS tokens(
  hash text primary key,
  user_id integer not null references users(id) ON DELETE CASCADE,
  expiry integer not null, 
);

