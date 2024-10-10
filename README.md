# TFG


# Backend Server con Node.js y Express

Este proyecto es un servidor backend desarrollado con **Node.js** y **Express**, que utiliza **MongoDB** para la base de datos, junto con otras integraciones como JWT, Cloudinary, Mailer, Stripe y más. MongoDB está configurado para ejecutarse en un contenedor Docker utilizando `docker-compose`.

## Requisitos previos

Asegúrate de tener lo siguiente instalado:

- **Node.js** (versión 14 o superior)
- **npm** (gestor de paquetes de Node.js)
- **Docker** y **Docker Compose** (para ejecutar MongoDB)

## Instalación
1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar `npm install` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo