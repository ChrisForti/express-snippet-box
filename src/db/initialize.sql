CREATE TABLE IF NOT EXISTS users(
    id SERIAL primary key,
    email text UNIQUE NOT NULL,
    first_name varchar(25) NOT NULL,
    last_name varchar(25)
);

/* Homework: Is another table called snippets,
 what ius the data we need, 
 lookup foreign key relationship.
We need a way track the users??? 
user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 snippet_owner integer not null,
    foreign key (snippet_owner) references users (id),*/

CREATE TABLE IF NOT EXISTS snippets(
    title varchar(255) not null,
    creation_date integer default extract (epoch from now()) not null,
    expiration_date integer not null,
    snippet_id uuid default gen_random_uuid() primary key not null,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content text not null
);

/*in project find a way to connect ourselves*/