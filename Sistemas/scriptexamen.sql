drop table generos;
drop table entradas;
drop table opiniones;
drop table ubicaciones;
drop table espectaculos;
drop table usuarios;
drop table generos;

-- Tabla de usuarios
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY,
    nombre VARCHAR(50),
    email VARCHAR(100),
    telefono VARCHAR(20)
);

-- Datos de ejemplo para la tabla de usuarios
INSERT INTO Usuarios (id_usuario, nombre, email, telefono) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', '600123456');
INSERT INTO Usuarios (id_usuario, nombre, email, telefono) VALUES
(2, 'Ana García', 'ana.garcia@example.com', '600789123');
INSERT INTO Usuarios (id_usuario, nombre, email, telefono) VALUES
(3, 'Carlos López', 'carlos.lopez@example.com', '600456789');

-- Tabla de géneros
CREATE TABLE Generos (
    id_genero INT PRIMARY KEY,
    nombre VARCHAR(50)
);

-- Datos de ejemplo para la tabla de géneros
INSERT INTO Generos (id_genero, nombre) VALUES
(1, 'Comedia');
INSERT INTO Generos (id_genero, nombre) VALUES
(2, 'Drama');
INSERT INTO Generos (id_genero, nombre) VALUES
(3, 'Acción');
INSERT INTO Generos (id_genero, nombre) VALUES
(4, 'Musical');
INSERT INTO Generos (id_genero, nombre) VALUES
(5, 'Romance');

-- Tabla de espectáculos
CREATE TABLE Espectaculos (
    id_espectaculo INT PRIMARY KEY,
    titulo VARCHAR(100),
    tipo int,
    fecha DATE,
    FOREIGN KEY (tipo) REFERENCES Generos(id_genero)
);

-- Datos de ejemplo para la tabla de espectáculos
INSERT INTO Espectaculos (id_espectaculo, titulo, tipo, fecha) VALUES
(1, 'Concierto de Rock', 1, to_date('2025-06-15', 'yyyy-mm-dd'));
INSERT INTO Espectaculos (id_espectaculo, titulo, tipo, fecha) VALUES
(2, 'Obra de Teatro', 2, to_date('2025-07-10', 'yyyy-mm-dd'));
INSERT INTO Espectaculos (id_espectaculo, titulo, tipo, fecha) VALUES
(3, 'Película de Estreno1', 2, to_date('2025-04-25', 'yyyy-mm-dd'));
INSERT INTO Espectaculos (id_espectaculo, titulo, tipo, fecha) VALUES
(4, 'Película de Estreno2', 1, to_date('2025-05-26', 'yyyy-mm-dd'));
INSERT INTO Espectaculos (id_espectaculo, titulo, tipo, fecha) VALUES
(5, 'Película de Estreno3', 1, to_date('2025-05-26', 'yyyy-mm-dd'));
INSERT INTO Espectaculos (id_espectaculo, titulo, tipo, fecha) VALUES
(6, 'Película de Estreno4', 1, to_date('2025-05-26', 'yyyy-mm-dd'));
INSERT INTO Espectaculos (id_espectaculo, titulo, tipo, fecha) VALUES
(7, 'Película de Estreno5', 1, to_date('2025-05-26', 'yyyy-mm-dd'));


-- Tabla de ubicaciones
CREATE TABLE Ubicaciones (
    id_ubicacion INT PRIMARY KEY,
    nombre VARCHAR(100),
    direccion VARCHAR(150),
    capacidad INT
);

-- Datos de ejemplo para la tabla de ubicaciones
INSERT INTO Ubicaciones (id_ubicacion, nombre, direccion, capacidad) VALUES
(1, 'Auditorio Nacional', 'Calle del Auditorio, 123', 2000);
INSERT INTO Ubicaciones (id_ubicacion, nombre, direccion, capacidad) VALUES
(2, 'Teatro Principal', 'Avenida del Teatro, 45', 500);
INSERT INTO Ubicaciones (id_ubicacion, nombre, direccion, capacidad) VALUES
(3, 'Cine Moderno', 'Plaza del Cine, 10', 300);

-- Tabla de entradas
CREATE TABLE Entradas (
    id_entrada INT PRIMARY KEY,
    id_espectaculo INT,
    id_usuario INT,
    fecha_compra DATE,
    precio DECIMAL(10,2),
    FOREIGN KEY (id_espectaculo) REFERENCES Espectaculos(id_espectaculo),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Datos de ejemplo para la tabla de entradas
INSERT INTO Entradas (id_entrada, id_espectaculo, id_usuario, fecha_compra, precio) VALUES
(1, 1, 1, to_date('2025-03-20','yyyy-mm-dd'), 50.00);
INSERT INTO Entradas (id_entrada, id_espectaculo, id_usuario, fecha_compra, precio) VALUES
(2, 2, 2, to_date('2025-03-25','yyyy-mm-dd'), 30.00);
INSERT INTO Entradas (id_entrada, id_espectaculo, id_usuario, fecha_compra, precio) VALUES
(3, 3, 3, to_date('2025-03-27','yyyy-mm-dd'), 15.00);
INSERT INTO Entradas (id_entrada, id_espectaculo, id_usuario, fecha_compra, precio) VALUES
(4, 2, 1, to_date('2025-03-28','yyyy-mm-dd'), 15.00);
INSERT INTO Entradas (id_entrada, id_espectaculo, id_usuario, fecha_compra, precio) VALUES
(5, 3, 1, to_date('2025-03-29','yyyy-mm-dd'), 15.00);

-- Tabla de opiniones
CREATE TABLE Opiniones (
    id_opinion INT PRIMARY KEY,
    id_usuario INT,
    id_espectaculo INT,
    comentario VARCHAR2(50),
    calificacion INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_espectaculo) REFERENCES Espectaculos(id_espectaculo)
);

-- Datos de ejemplo para la tabla de opiniones
INSERT INTO Opiniones (id_opinion, id_usuario, id_espectaculo, comentario, calificacion) VALUES
(1, 1, 1, '¡Excelente concierto!', 5);
INSERT INTO Opiniones (id_opinion, id_usuario, id_espectaculo, comentario, calificacion) VALUES
(2, 2, 2, 'La obra fue muy emotiva.', 4);
INSERT INTO Opiniones (id_opinion, id_usuario, id_espectaculo, comentario, calificacion) VALUES
(3, 3, 3, 'Buena película, aunque algo larga.', 3);
INSERT INTO Opiniones (id_opinion, id_usuario, id_espectaculo, comentario, calificacion) VALUES
(4, 1, 2, null, 8);
INSERT INTO Opiniones (id_opinion, id_usuario, id_espectaculo, comentario, calificacion) VALUES
(5, 1, 3, 'Maravilla', 10);
