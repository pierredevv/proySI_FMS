# Base de datos local

Archivos principales:

- `schema.sql`: estructura completa exportada desde PostgreSQL.
- `seed.sql`: datos minimos para iniciar el sistema.
- `migrations/001_align_ciclo2.sql`: migracion idempotente para columnas y permisos de ciclo 2.

Usuario inicial:

- Usuario: `superuser`
- Password: `Admin123!@#`
- Rol: `SuperUsuario`

Comandos utiles desde `backend/`:

```bash
npm run db:up
npm run db:migrate
npm run dev
```

Si el volumen `pgdata` ya existia, Docker no vuelve a ejecutar los SQL de inicializacion. En ese caso usa `npm run db:migrate` para aplicar los cambios a la base actual.
