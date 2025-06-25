create table users (
	user_id SERIAL PRIMARY KEY,
	user_email VARCHAR(255) UNIQUE NOT NULL,
	user_password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table image (
	image_id SERIAL PRIMARY KEY,
	image_name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	image_file bytea NOT NULL,
	user_id INTEGER NOT NULL,
	CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
		ON DELETE CASCADE
);

CREATE table album (
	album_id SERIAL PRIMARY KEY,
	album_name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	album_preview INTEGER,
	user_id INTEGER NOT NULL,
	CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
		ON DELETE CASCADE
);

CREATE TABLE album_image_junction (
	album_id INTEGER NOT NULL,
	image_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	PRIMARY KEY(album_id, image_id),
	CONSTRAINT fk_image FOREIGN KEY (image_id) REFERENCES image(image_id)
		ON DELETE CASCADE,
	CONSTRAINT fk_album FOREIGN KEY (album_id) REFERENCES album(album_id)
		ON DELETE CASCADE
	CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
		ON DELETE CASCADE
);