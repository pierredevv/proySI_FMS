# 📦 Proyecto Final — SI1 (Sistemas de Información I)

> Sistema de información para la gestión académica, financiera, control de inventarios y seguridad estudiantil de la **Unidad Educativa Fausto Medrano Sandoval "A"**.

Este es el **Backend** del sistema, desarrollado con **Node.js**, **Express** y **PostgreSQL**.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu máquina antes de comenzar:
- [Node.js](https://nodejs.org) (v16 o superior recomendado)
- [Docker y Docker Desktop](https://docker.com) (para la base de datos)
- Git
- Un cliente SQL (DBeaver, pgAdmin o Postman para pruebas)

---

## 📥 Instalación y Configuración

### 1. Clonar el repositorio y gestionar ramas
Actualmente, el desarrollo del backend se trabaja en la rama `DevP` (creada por Yimy). El flujo de trabajo consiste en avanzar en esta rama y, una vez que Freed suba su parte a `DevF`, se realizará el pull de sus cambios para completar el primer ciclo.

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Entrar a la carpeta del proyecto
cd <NOMBRE_DE_LA_CARPETA>

# Cambiar a la rama de desarrollo actual
git checkout DevP

### 2. Instalar dependencias
Para este proyecto utilizamos exclusivamente npm:

```bash
npm install
```
## 🗄️ Configuración de la Base de Datos

### 1. Levantar PostgreSQL con Docker
Asegúrate de tener Docker abierto. En la raíz del proyecto, ejecuta el siguiente comando para crear y levantar el contenedor en segundo plano:

```bash
docker-compose up -d
```
Para detener la base de datos más adelante, puedes usar docker-compose down.

### 2. Inicializar la Base de Datos
La base de datos se creará vacía. Debes conectarte a ella utilizando un cliente SQL con las credenciales configuradas en el archivo `.env` (`localhost:5432`) y ejecutar el script SQL del proyecto para crear las tablas (`rol`, `usuario`, `permiso`, etc.) e insertar los datos de prueba.

---

## 🌐 Variables de Entorno (`.env`)
Crea un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json`). **Nota:** No subas este archivo a Git.

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=proyecto_si1_db
DB_PASSWORD=admin123
DB_PORT=5432
JWT_SECRET=escribe_aqui_un_secreto_seguro_para_jwt
```

## 🚀 Uso

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

## 🧪 Pruebas

Si necesitas realizar pruebas (disponibles para el front o vía terminal):

```bash
npm run test
```

## 📡 Endpoints Disponibles (Fase 1)

### 🔐 Autenticación (`/api/auth`)

- `POST /api/auth/login` – Iniciar sesión. Requiere `username` y `password` en el body. Retorna el Token JWT y el rol del usuario.
- `POST /api/auth/logout` – Finalizar la sesión actual.

### 👤 Gestión de Usuarios (`/api/users`)

> **Nota:** Para probar estos endpoints, enviar la estructura en formato JSON.

- `GET /api/users` – Obtener lista de todos los usuarios registrados.
- `POST /api/users` – Crear un nuevo usuario (Requiere `username`, `password`, `id_rol`).
- `PUT /api/users/:id` – Actualizar la información de un usuario existente.
- `DELETE /api/users/:id` – Eliminar un usuario permanentemente por su ID.

---

## 🤝 Contribuir

1. Haz un fork del repositorio.
2. Crea una rama con tu feature: `git checkout -b feature/mi-feature`.
3. Realiza tus cambios y haz commit: `git commit -m "feat: descripción"`.
4. Sube la rama: `git push origin feature/mi-feature`.
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
