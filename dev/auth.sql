create table users(
	id serial primary key,
	full_name varchar(150),
	user_name varchar(50),
	user_phone varchar(15) check(length(user_phone)>=10),
	user_email varchar(150),
	user_password varchar(16)
)