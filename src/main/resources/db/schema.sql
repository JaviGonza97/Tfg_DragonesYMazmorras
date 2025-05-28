-- Borra tablas antiguas en cada arranque (útil en H2 in-memory)
DROP TABLE IF EXISTS usuario_roles;
DROP TABLE IF EXISTS personaje_hechizo;
DROP TABLE IF EXISTS equipo;
DROP TABLE IF EXISTS personaje;
DROP TABLE IF EXISTS estadistica;
DROP TABLE IF EXISTS hechizo;
DROP TABLE IF EXISTS clase;
DROP TABLE IF EXISTS raza;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS usuario;

-- Usuarios
CREATE TABLE usuario (
                         id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                         username         VARCHAR(255) NOT NULL UNIQUE,
                         password         VARCHAR(255) NOT NULL,
                         email            VARCHAR(255) NOT NULL UNIQUE
);

-- Roles
CREATE TABLE rol (
                     id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                     nombre           VARCHAR(255) NOT NULL UNIQUE
);

-- Join usuario ↔ rol
CREATE TABLE usuario_roles (
                               usuario_id       BIGINT NOT NULL,
                               rol_id           BIGINT NOT NULL,
                               PRIMARY KEY (usuario_id, rol_id),
                               FOREIGN KEY (usuario_id) REFERENCES usuario(id),
                               FOREIGN KEY (rol_id)     REFERENCES rol(id)
);

-- Razas
CREATE TABLE raza (
                      id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                      nombre           VARCHAR(255) NOT NULL UNIQUE
);

-- Clases
CREATE TABLE clase (
                       id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                       nombre           VARCHAR(255) NOT NULL UNIQUE
);

-- Hechizos
CREATE TABLE hechizo (
                         id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nombre           VARCHAR(255) NOT NULL,
                         nivel            VARCHAR(255),
                         descripcion      TEXT
);

-- Estadísticas
CREATE TABLE estadistica (
                             id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                             fuerza           INT,
                             destreza         INT,
                             resistencia      INT,
                             magia            INT
);

-- Personajes
CREATE TABLE personaje (
                           id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nombre           VARCHAR(255),
                           raza_personaje   BIGINT,
                           clase_personaje  BIGINT,
                           usuario_personaje BIGINT,
                           estadistica_id   BIGINT,
                           FOREIGN KEY (raza_personaje)    REFERENCES raza(id),
                           FOREIGN KEY (clase_personaje)   REFERENCES clase(id),
                           FOREIGN KEY (usuario_personaje) REFERENCES usuario(id),
                           FOREIGN KEY (estadistica_id)    REFERENCES estadistica(id)
);

-- Equipos
CREATE TABLE equipo (
                        id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                        nombre           VARCHAR(255),
                        tipo             VARCHAR(50) NOT NULL,
                        personaje_id     BIGINT,
                        FOREIGN KEY (personaje_id) REFERENCES personaje(id)
);

-- Relación N–N Personaje ↔ Hechizo
CREATE TABLE personaje_hechizo (
                                   personaje_id     BIGINT NOT NULL,
                                   hechizo_id       BIGINT NOT NULL,
                                   PRIMARY KEY (personaje_id, hechizo_id),
                                   FOREIGN KEY (personaje_id) REFERENCES personaje(id),
                                   FOREIGN KEY (hechizo_id)    REFERENCES hechizo(id)
);
