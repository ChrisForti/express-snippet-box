CREATE TABLE IF NOT EXISTS users(
    id SERIAL,
    email text UNIQUE NOT NULL,
    first_name varchar(25) NOT NULL,
    last_name varchar(25)
);

/* Homework: Is another table called snippets,
 what ius the data we need, 
 lookup foreign key relationship.
We need a way track the users??? */

CREATE TABLE IF NOT EXISTS snippets(
    title varchar(100) not null,
    creation_date int default extract (epoch from now()) not null,
    expiration_date int default extract (epoch from now() + interval '1 month') not null,
    snippet_id uuid default gen_random_uuid() primary key not null,
    snippet_owner integer not null,
    foreign key (snippet_owner) references users (id),
    content text not null
);
