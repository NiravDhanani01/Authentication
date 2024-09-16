create table users(
	id serial primary key,
	full_name varchar(150),
	user_name varchar(50),
	user_phone varchar(15) check(length(user_phone)>=10),
	user_email varchar(150),
	user_password varchar(150)
)

create table tokens(
	id serial primary key,
	user_id int,
	foreign key (user_id) references users(id),
	refresh_token varchar(150)
)


