CREATE DATABASE IF NOT EXISTS asistenciadb;


create table tiposeguro(
id_tipo_seguro Int not null auto_increment primary key, 
nombre varchar(50),
descripcion varchar(50) 
);

create table estadocivil(
id_estado_civil Int not null auto_increment primary key, 
nombre varchar(50),
descripcion varchar(50) 
);

CREATE TABLE persona(
    id_persona Int not null auto_increment primary key, 
    nombre varchar(50),
    apellidoPaterno varchar(50),
    apellidoMaterno varchar(50),
    dni varchar(8),
    correo varchar(50),
    direccion varchar(50),
    numero_hijos Int,
    id_estado_civil int,
    asegurado varchar(50),
    id_tipo_seguro int,
    sueldo int,
    fechaDeNacimiento varchar(50),
    fechaIngreso varchar(50),
    FOREIGN KEY (id_estado_civil) REFERENCES estadocivil(id_estado_civil),
    FOREIGN KEY (id_tipo_seguro) REFERENCES tiposeguro(id_tipo_seguro)
);




create table rol(
    id_rol Int not null auto_increment primary key,
    nombre varchar(50),
    descripcion varchar(50)

);

create table usuario(

    id_usuario Int not null auto_increment primary key,
    id_persona int,
    id_rol int,
    usuario varchar(50),
    contraseña varchar(50),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona)
);


create table tipohorario(
 id_tipo_horario int not null auto_increment primary key,
 nombre varchar(50),
 descripcion varchar(50),
 cantidad_horas int
);

create table horario(
id_horario int not null auto_increment primary key,
id_usuario int,
id_tipo_horario int,
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
FOREIGN KEY (id_tipo_horario) REFERENCES tipohorario(id_tipo_horario)
);

create table marcacion(
 id_marcacion int not null auto_increment primary key,
 id_horario int,
 semana int,
 mes int,
 horas_marcadas int,
 FOREIGN KEY (id_horario) REFERENCES horario(id_horario)
);

create table tipomarcacion(
 id_tipo_marcacion int not null auto_increment primary key,
 nombre varchar(50),
 descripcion varchar(50)
);

create table detallemarcacion(
id_detalle_marcacion int not null auto_increment primary key,
id_marcacion int,
id_tipo_marcacion int,
comentario varchar(50),
fecha varchar(50),
horas_marcadas int,
 FOREIGN KEY (id_marcacion) REFERENCES marcacion(id_marcacion),
 FOREIGN KEY (id_tipo_marcacion) REFERENCES tipomarcacion(id_tipo_marcacion)
);


