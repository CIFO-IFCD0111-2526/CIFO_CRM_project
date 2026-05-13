# Migrations manuales

`sequelize.sync()` (sin `{ alter: true }`) **NO añade/modifica columnas** en tablas existentes — solo crea tablas que no existen.

Cada vez que se añade/quita/renombra una columna, se documenta aquí con un script SQL. Hay que ejecutarlo a mano contra la BD:

```bash
mysql -u <user> -p <database> < docs/migrations/001-alumno-accion-difusion.sql
```

## Convenciones

- Numeración secuencial: `001-`, `002-`, `003-`...
- Nombre: `NNN-tabla-cambio.sql`
- Cabecera con: número, issue/PR, fecha, explicación.
- Operaciones destructivas (DROP COLUMN/TABLE) deben advertirse y, si hay datos, incluir backup previo.

## Pendientes futuros

Cuando las migraciones se compliquen, valorar pasar a `sequelize-cli` con archivos versionados y `npx sequelize db:migrate`.
