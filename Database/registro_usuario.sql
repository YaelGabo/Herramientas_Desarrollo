-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2024 a las 09:28:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `registro_usuario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `primerApellido` varchar(50) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `numeroTelefonico` varchar(20) NOT NULL,
  `correoElectronico` varchar(100) NOT NULL,
  `nombreUsuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `tipoUsuario` enum('Usuario','Administrador') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `primerApellido`, `dni`, `direccion`, `numeroTelefonico`, `correoElectronico`, `nombreUsuario`, `contrasena`, `tipoUsuario`) VALUES
(5, 'Ramiro', 'Ramirez', '78421137', 'Lince', '945875135', 'ramiroramirez@gmail.com', 'ARamiro18', '$2y$10$bXlV6RLZGZWP9uWIJ0SM4uMEX6iNVXEJ2IehvqWIb05zqaJCB/ZMm', 'Usuario'),
(7, 'Sebastian', 'Barron', '730937771', 'San Luis', '9684799504', 'Sebitas123@gmail.com', 'ASebas123', '$2y$10$TAcuRry/nsl3S7X6A8hUVOtPh6VKjfWyW2hEG8k2lLKEI5WvgyHO6', 'Usuario'),
(8, 'Oscar', 'Ibañez', '79611842', 'Milaflores', '78425846', 'oscaribanez@gmail.com', 'UOscar85', '$2y$10$ru5U8RGHVo6g0cDu5JEXGugPTNCIvmj3.3mAIsHdPcf5tbqT.zvoa', 'Usuario'),
(11, 'Ronaldo', 'Rafael', '73254668', 'Independencia', '975748412', 'ronaldo@gmail.com', 'URonaldo07', '$2y$10$KidLeJywhyEsK3M39k98X.MrQqSfl0jYzhwvfTl5xbqmWkSOUlVqW', 'Usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `correoElectronico` (`correoElectronico`),
  ADD UNIQUE KEY `nombreUsuario` (`nombreUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SELECT * FROM `usuarios` WHERE 1