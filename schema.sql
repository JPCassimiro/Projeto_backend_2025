create table image (
	image_id SERIAL PRIMARY KEY,
	image_name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	image_file bytea NOT NULL
);

CREATE table album (
	album_id SERIAL PRIMARY KEY,
	album_name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP not null,
	album_preview SERIAL NOT NULL
);

CREATE TABLE album_image_junction (
	album_id SERIAL NOT NULL,
	image_id SERIAL NOT NULL,
	PRIMARY KEY(album_id, image_id),
	CONSTRAINT fk_image FOREIGN KEY (image_id) REFERENCES image(image_id)
		ON DELETE CASCADE,
	CONSTRAINT fk_album FOREIGN KEY (album_id) REFERENCES album(album_id)
		ON DELETE CASCADE
);

	