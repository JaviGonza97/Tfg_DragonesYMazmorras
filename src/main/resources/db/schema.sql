CREATE TABLE usuario (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         username VARCHAR(255) UNIQUE NOT NULL,
                         password VARCHAR(255) NOT NULL
);

CREATE TABLE raza (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      nombre VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE clase (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       nombre VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE hechizo (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nombre VARCHAR(255) NOT NULL,
                         nivel VARCHAR(255),
                         descripcion TEXT
);

CREATE TABLE habilidad (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nombre VARCHAR(255) NOT NULL,
                           valor INT NOT NULL
);

CREATE TABLE personaje (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nombre VARCHAR(255) NOT NULL,
                           raza_personaje BIGINT,
                           clase_personaje BIGINT,
                           usuario_personaje BIGINT,
                           FOREIGN KEY (raza_personaje) REFERENCES raza(id),
                           FOREIGN KEY (clase_personaje) REFERENCES clase(id),
                           FOREIGN KEY (usuario_personaje) REFERENCES usuario(id)
);

CREATE TABLE equipo (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        nombre VARCHAR(255),
                        tipo VARCHAR(255),
                        personaje_id BIGINT,
                        FOREIGN KEY (personaje_id) REFERENCES personaje(id)
);

CREATE TABLE personaje_hechizo (
                                   personaje_id BIGINT NOT NULL,
                                   hechizo_id BIGINT NOT NULL,
                                   PRIMARY KEY (personaje_id, hechizo_id),
                                   FOREIGN KEY (personaje_id) REFERENCES personaje(id),
                                   FOREIGN KEY (hechizo_id) REFERENCES hechizo(id)
);

CREATE TABLE personaje_habilidad (
                                     personaje_id BIGINT NOT NULL,
                                     habilidad_id BIGINT NOT NULL,
                                     PRIMARY KEY (personaje_id, habilidad_id),
                                     FOREIGN KEY (personaje_id) REFERENCES personaje(id),
                                     FOREIGN KEY (habilidad_id) REFERENCES habilidad(id)
);
