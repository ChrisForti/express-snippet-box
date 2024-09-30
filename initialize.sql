CREATE TABLE IF NOT EXISTS users(
    id SERIAL,
    email text UNIQUE NOT NULL,
    first_name varchar(25) NOT NULL,
    last_name varchar(25)
);

/* Another table called snippets, what ius the data we need, lookup foreign key relationship.
We need a way track the users??? */