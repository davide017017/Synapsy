php -r "echo password_hash('LaTuaPasswordQui', PASSWORD_BCRYPT), PHP_EOL;"

begin;

insert into users
(name, email, password, created_at, updated_at)
values
('Davide', 'davide@example.com', '$2y$10$...HASH_BCRYPT...', now(), now());

-- verifica
select id, name, email, created_at
from users
where email = 'davide@example.com';

commit;
